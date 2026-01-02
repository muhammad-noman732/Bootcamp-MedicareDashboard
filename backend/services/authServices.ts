import {
    type AuthSchema,
    type LoginSchema,
} from "../schema/userSchema";
import type { AuthRepository } from "../repositories/authRepository"; // Updated import name
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
import crypto from 'crypto'
export class AuthService {
    private readonly SALT_ROUNDS = 12;

    constructor(
        private authRepository: AuthRepository,
        private jwtService: JwtService
    ) { }

    async createUser(data: AuthSchema): Promise<{
        user: AuthUserResponse,
        accessToken: string,
        refreshToken: string
    }> {
        const existingUser = await this.authRepository.findByEmailWithPassword(data.email);

        if (existingUser) {
            throw new ConflictError("Email already registered");
        }

        const hashPassword = await bcryptjs.hash(data.password, this.SALT_ROUNDS);

        const user = await this.authRepository.createUser({
            ...data,
            password: hashPassword,
        });

        if (!user) {
            throw new InternalServerError("Failed to create user");
        }

        const accessToken = this.jwtService.generateAccessToken(user.id);
        const refreshToken = this.jwtService.generateRefreshToken(user.id);

        const hashedRefreshToken = await this.hashToken(refreshToken)
        await this.authRepository.createRefreshToken(
            user.id,
            hashedRefreshToken,
            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        );

        return {
            user,
            accessToken,
            refreshToken,
        };
    }

    async loginUser(data: LoginSchema): Promise<{ accessToken: string, refreshToken: string, user: AuthUserResponse }> {
        const user = await this.authRepository.findByEmailWithPassword(data.email);

        if (!user) {
            throw new NotFoundError("User");
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

        const hashedRefreshToken = this.hashToken(refreshToken)

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
        }
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
        return crypto.createHash('sha256').update(token).digest('hex')
    }
}