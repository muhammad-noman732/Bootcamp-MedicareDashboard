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
        message: string
    }> {
        // Ensure email is lowercased
        const emailLower = data.email.toLowerCase();
        const existingUser = await this.authRepository.findByEmailWithPassword(emailLower);

        if (existingUser) {
            throw new ConflictError("Email already registered");
        }

        const hashPassword = await bcryptjs.hash(data.password, this.SALT_ROUNDS);

        const user = await this.authRepository.createUser({
            ...data,
            email: data.email.toLowerCase(), // Ensure consistent casing
            password: hashPassword,
        });

        if (!user) {
            throw new InternalServerError("Failed to create user");
        }

        // Generate OTP
        const otp = this.generateOTP();
        const hashedOTP = this.hashOTP(otp);
        const expiresAt = new Date(Date.now() + this.OTP_EXPIRY_MINUTES * 60 * 1000);

        // Store OTP in database
        await this.authRepository.createEmailVerification(
            user.id,
            hashedOTP,
            expiresAt
        );

        // Send verification email
        const emailHtml = verificationEmailTemplate(user.userName, otp);
        await this.sendGridService.sendVerificationEmail(user.email, user.userName, emailHtml);

        return {
            user,
            message: "Verification OTP sent to your email. Please verify to continue."
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
            // This could mean token theft!
            await this.authRepository.revokeRefreshTokensByUserId(decoded.userId);
            throw new UnauthorizedError("Invalid refresh token");
        }

        if (storedToken.expiresAt < new Date()) {
            await this.authRepository.revokeRefreshToken(tokenHash);
            throw new UnauthorizedError("Refresh token expired");
        }

        // 4. Rotate (delete old token)
        await this.authRepository.revokeRefreshToken(tokenHash);

        // 5. Issue new tokens
        const newAccessToken = this.jwtService.generateAccessToken(decoded.userId);

        const newRefreshToken = this.jwtService.generateRefreshToken(decoded.userId);

        const newRefreshTokenHash = this.hashToken(newRefreshToken);

        // 6. Store new refresh token
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
        email: string,
        otp: string
    ): Promise<{
        user: AuthUserResponse,
        accessToken: string,
        refreshToken: string
    }> {
        const normalizedEmail = email.toLowerCase();
        const user = await this.authRepository.findByEmailWithPassword(normalizedEmail);

        if (!user) {
            throw new NotFoundError("User");
        }

        if (user.isVerified) {
            throw new ConflictError("Email already verified");
        }

        const verification = await this.authRepository.findEmailVerification(user.id);

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

        await this.authRepository.markUserAsVerified(user.id);
        await this.authRepository.markVerificationAsUsed(verification.id);
        const accessToken = this.jwtService.generateAccessToken(user.id);
        const refreshToken = this.jwtService.generateRefreshToken(user.id);

        const hashedRefreshToken = this.hashToken(refreshToken);
        await this.authRepository.createRefreshToken(
            user.id,
            hashedRefreshToken,
            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        );

        const verifiedUser = await this.authRepository.findById(user.id);

        if (!verifiedUser) {
            throw new InternalServerError("User profile not found");
        }

        return {
            user: verifiedUser,
            accessToken,
            refreshToken,
        };
    }


    async resendVerificationOTP(email: string): Promise<{ message: string }> {
        const user = await this.authRepository.findByEmailWithPassword(email.toLowerCase());

        if (!user) {
            throw new NotFoundError("User not found");
        }

        if (user.isVerified) {
            throw new ConflictError("Email already verified");
        }

        // Check rate limiting (prevent spam)
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

        // Generate new OTP
        const otp = this.generateOTP();
        const hashedOtp = this.hashOTP(otp);
        const expiresAt = new Date(Date.now() + this.OTP_EXPIRY_MINUTES * 60 * 1000);

        await this.authRepository.createEmailVerification(
            user.id,
            hashedOtp,
            expiresAt,
            true
        );

        // Send email
        const emailHtml = verificationEmailTemplate(user.userName, otp);
        await this.sendGridService.sendVerificationEmail(user.email, user.userName, emailHtml);

        return {
            message: "New verification OTP sent to your email."
        };
    }

    async googleLogin(email: string, name: string, picture: string, sub: string): Promise<{ accessToken: string, refreshToken: string, user: AuthUserResponse }> {

        let user = await this.authRepository.findByGoogleId(sub);

        if (!user) {
            // 2. If not found by Google ID, check by email (Account Linking)
            user = await this.authRepository.findByEmailWithPassword(email.toLowerCase());

            if (user) {
                // Link existing account with Google ID
                user = await this.authRepository.updateUser(user.id, {
                    googleId: sub,
                    isVerified: true, // Google verifies email
                    avatar: user.avatar || picture // Keep existing avatar or use Google's
                });
            } else {
                // 3. Create new user (Signup)
                // Password is not needed for Google users (User model has password as optional)
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

                // Fetch the full user object (compatible with User type)
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
}