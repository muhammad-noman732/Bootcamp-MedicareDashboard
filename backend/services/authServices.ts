import {
    type AuthSchema,
    type LoginSchema,
} from "../schema/userSchema";
import type { AuthRepository } from "../repositories/authRepository";
import type { User } from "../generated/prisma/client";
import {
    ConflictError,
    NotFoundError,
    UnauthorizedError,
    InternalServerError,
} from "../utils/appError";
import bcryptjs from "bcryptjs";
import { JwtService } from "../lib/jwt";
import { AuthUserResponse } from "../types/authTypes";
import crypto from 'crypto';
import { SendGridService } from "../lib/sendGrid";
import { verificationEmailTemplate } from "../template/email/verificationEmail";


export class AuthService {
    private readonly SALT_ROUNDS = 12;
    private readonly OTP_EXPIRY_MINUTES = 10;

    constructor(
        private authRepository: AuthRepository,
        private jwtService: JwtService,
        private sendGridService: SendGridService
    ) { }


    async createUser(data: AuthSchema): Promise<{
        user: AuthUserResponse,
        message: string,
        verifyToken: string
    }> {
        const emailLower = data.email.toLowerCase();
        const existingUser = await this.authRepository.findByEmailWithPassword(emailLower);

        if (existingUser) {
            if (existingUser.isVerified) {
                throw new ConflictError("Email already registered. Please login.");
            }
            await this.authRepository.deleteUserById(existingUser.id);
        }

        const hashPassword = await bcryptjs.hash(data.password, this.SALT_ROUNDS);

        const user = await this.authRepository.createUser({
            ...data,
            email: emailLower,
            password: hashPassword,
        });

        if (!user) {
            throw new InternalServerError("Failed to create user");
        }

        const otp = this.generateOTP();
        const hashedOTP = this.hashOTP(otp);
        const expiresAt = new Date(Date.now() + this.OTP_EXPIRY_MINUTES * 60 * 1000);

        await this.authRepository.createEmailVerification(
            user.id,
            hashedOTP,
            expiresAt
        );

        const verifyToken = this.jwtService.generateVerifyToken(user.email, user.id);

        const emailHtml = verificationEmailTemplate(user.userName, otp);
        await this.sendGridService.sendVerificationEmail(user.email, user.userName, emailHtml);

        return {
            user,
            message: "Verification OTP sent to your email. Please verify to continue.",
            verifyToken
        };
    }


    async loginUser(data: LoginSchema): Promise<{ accessToken: string, refreshToken: string, user: AuthUserResponse }> {
        const user = await this.authRepository.findByEmailWithPassword(data.email.toLowerCase());

        if (!user) {
            throw new NotFoundError("User");
        }

        if (!user.isVerified) {
            throw new UnauthorizedError(
                "Please verify your email before logging in. Check your inbox for the verification OTP."
            );
        }

        if (!user.password) {
            throw new UnauthorizedError("Please login with Google or reset your password.");
        }

        const isPasswordMatch = await bcryptjs.compare(
            data.password,
            user.password
        );

        if (!isPasswordMatch) {
            throw new UnauthorizedError("Invalid credentials");
        }

        const accessToken = this.jwtService.generateAccessToken(user.id);
        const refreshToken = this.jwtService.generateRefreshToken(user.id);

        const hashedRefreshToken = this.hashToken(refreshToken);

        await this.authRepository.createRefreshToken(
            user.id,
            hashedRefreshToken,
            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        );

        const userProfile = await this.authRepository.findById(user.id);

        if (!userProfile) {
            throw new InternalServerError("User profile not found");
        }

        return {
            accessToken,
            refreshToken,
            user: userProfile
        };
    }

    async refreshAccessToken(
        refreshToken: string
    ): Promise<{ accessToken: string; refreshToken: string }> {

        const decoded = this.jwtService.verifyRefreshToken(refreshToken);

        const tokenHash = this.hashToken(refreshToken);

        const storedToken = await this.authRepository.findRefreshToken(tokenHash);

        if (!storedToken) {
            await this.authRepository.revokeRefreshTokensByUserId(decoded.userId);
            throw new UnauthorizedError("Invalid refresh token");
        }

        if (storedToken.expiresAt < new Date()) {
            await this.authRepository.revokeRefreshToken(tokenHash);
            throw new UnauthorizedError("Refresh token expired");
        }

        await this.authRepository.revokeRefreshToken(tokenHash);

        const newAccessToken = this.jwtService.generateAccessToken(decoded.userId);

        const newRefreshToken = this.jwtService.generateRefreshToken(decoded.userId);

        const newRefreshTokenHash = this.hashToken(newRefreshToken);

        await this.authRepository.createRefreshToken(
            decoded.userId,
            newRefreshTokenHash,
            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        );

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        };
    }


    async logoutUser(refreshToken: string): Promise<void> {
        const hashedRefreshToken = this.hashToken(refreshToken)
        await this.authRepository.revokeRefreshToken(hashedRefreshToken);
    }



    hashToken(token: string): string {
        return crypto.createHash('sha256').update(token).digest('hex');
    }

    private generateOTP(): string {
        return crypto.randomInt(100000, 999999).toString();
    }

    private hashOTP(otp: string): string {
        return crypto.createHash('sha256').update(otp).digest('hex');
    }


    async verifyEmail(
        userId: string,
        otp: string
    ): Promise<{
        user: AuthUserResponse,
        accessToken: string,
        refreshToken: string
    }> {

        const userCheck = await this.authRepository.findByIdWithVerification(userId);

        if (!userCheck) {
            throw new NotFoundError("User");
        }

        if (userCheck.isVerified) {
            throw new ConflictError("Email already verified");
        }

        const verification = await this.authRepository.findEmailVerification(userId);

        if (!verification) {
            throw new UnauthorizedError("No pending verification found. Please request a new OTP.");
        }

        if (verification.expiresAt < new Date()) {
            throw new UnauthorizedError("OTP has expired. Please request a new one.");
        }

        if (verification.attempts >= 5) {
            throw new UnauthorizedError("Too many failed attempts. Please request a new OTP.");
        }

        const hashedInputOtp = this.hashOTP(otp);

        if (hashedInputOtp !== verification.hashedOtp) {
            await this.authRepository.incrementVerificationAttempts(verification.id);

            const remainingAttempts = 5 - (verification.attempts + 1);
            throw new UnauthorizedError(
                `Invalid OTP. ${remainingAttempts} attempts remaining.`
            );
        }

        await this.authRepository.markUserAsVerified(userId);
        await this.authRepository.markVerificationAsUsed(verification.id);
        const accessToken = this.jwtService.generateAccessToken(userId);
        const refreshToken = this.jwtService.generateRefreshToken(userId);

        const hashedRefreshToken = this.hashToken(refreshToken);
        await this.authRepository.createRefreshToken(
            userId,
            hashedRefreshToken,
            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        );

        const verifiedUser = await this.authRepository.findById(userId);

        if (!verifiedUser) {
            throw new InternalServerError("User profile not found");
        }

        return {
            user: verifiedUser,
            accessToken,
            refreshToken,
        };
    }


    async resendVerificationOTP(userId: string): Promise<{ message: string, verifyToken: string }> {
        const user = await this.authRepository.findByIdWithVerification(userId);

        if (!user) {
            throw new NotFoundError("User not found");
        }

        if (user.isVerified) {
            throw new ConflictError("Email already verified");
        }

        const existingVerification = await this.authRepository.findEmailVerification(user.id);

        if (existingVerification) {
            const timeUntilExpiry = existingVerification.expiresAt.getTime() - Date.now();

            if (timeUntilExpiry > 0) {
                const secondsRemaining = Math.ceil(timeUntilExpiry / 1000);
                throw new ConflictError(
                    `An OTP is already active. Please wait ${secondsRemaining} seconds before requesting a new one, or use the existing OTP.`
                );
            }
        }

        const otp = this.generateOTP();
        const hashedOtp = this.hashOTP(otp);
        const expiresAt = new Date(Date.now() + this.OTP_EXPIRY_MINUTES * 60 * 1000);

        await this.authRepository.createEmailVerification(
            user.id,
            hashedOtp,
            expiresAt,
            true
        );

        const verifyToken = this.jwtService.generateVerifyToken(user.email, user.id);

        const emailHtml = verificationEmailTemplate(user.userName, otp);
        await this.sendGridService.sendVerificationEmail(user.email, user.userName, emailHtml);

        return {
            message: "New verification OTP sent to your email.",
            verifyToken
        };
    }

    async googleLogin(email: string, name: string, picture: string, sub: string): Promise<{ accessToken: string, refreshToken: string, user: AuthUserResponse }> {

        let user = await this.authRepository.findByGoogleId(sub);

        if (!user) {

            user = await this.authRepository.findByEmailWithPassword(email.toLowerCase());

            if (user) {
                user = await this.authRepository.updateUser(user.id, {
                    googleId: sub,
                    isVerified: true,
                    avatar: user.avatar || picture
                });
            } else {

                const newUser = await this.authRepository.createUser({
                    email: email.toLowerCase(),
                    userName: name,
                    name: name,
                    googleId: sub,
                    avatar: picture,
                    isVerified: true,
                    isActive: true
                });

                if (!newUser) {
                    throw new InternalServerError("Failed to create user via Google Login");
                }

                user = await this.authRepository.findByGoogleId(sub);
            }
        }

        if (!user) {
            throw new InternalServerError("User processing failed");
        }

        const accessToken = this.jwtService.generateAccessToken(user.id);
        const refreshToken = this.jwtService.generateRefreshToken(user.id);

        const hashedRefreshToken = this.hashToken(refreshToken);

        await this.authRepository.createRefreshToken(
            user.id,
            hashedRefreshToken,
            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        );

        const userProfile = await this.authRepository.findById(user.id);

        if (!userProfile) {
            throw new InternalServerError("User profile not found");
        }

        return {
            user: userProfile,
            accessToken,
            refreshToken,
        };
    }

    async getCurrentUser(id: string): Promise<AuthUserResponse> {
        const user = await this.authRepository.findById(id);

        if (!user) {
            throw new NotFoundError("User not found");
        }

        if (!user.isActive) {
            throw new UnauthorizedError("User account is deactivated");
        }

        return user;
    }
}

