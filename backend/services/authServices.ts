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

export class AuthService {
    private readonly SALT_ROUNDS = 12;

    constructor(
        private authRepository: AuthRepository,
        private jwtService: JwtService
    ) { }

    async createUser(data: AuthSchema): Promise<{
        user: Partial<User>,
        accessToken: string,
        refreshToken: string
    }> {
        const existingUser = await this.authRepository.findByEmail(data.email);

        if (existingUser) {
            throw new ConflictError("Email already registered");
        }

        const hashPassword = await bcryptjs.hash(data.password, this.SALT_ROUNDS);

        const user = await this.authRepository.createUser({
            ...data,
            password: hashPassword,
        });

        if (!user.id) {
            throw new InternalServerError("Failed to create user");
        }

        const accessToken = this.jwtService.generateAccessToken(user.id);
        const refreshToken = this.jwtService.generateRefreshToken(user.id);

        // Store refresh token
        await this.authRepository.createRefreshToken(
            user.id,
            refreshToken,
            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        );

        // Return user without password
        const { password, ...userWithoutPassword } = user;

        return {
            user: userWithoutPassword,
            accessToken,
            refreshToken,
        };
    }

    async loginUser(data: LoginSchema): Promise<{ accessToken: string, refreshToken: string, user: Partial<User> | null }> {
        const user = await this.authRepository.findByEmail(data.email);

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

        await this.authRepository.createRefreshToken(
            user.id,
            refreshToken,
            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        );

        const userProfile = await this.authRepository.findById(user.id);

        return {
            accessToken,
            refreshToken,
            user: userProfile
        }
    }

    async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
        const decoded = this.jwtService.verifyRefreshToken(refreshToken);

        const storedToken = await this.authRepository.findRefreshToken(refreshToken);

        if (!storedToken) {
            throw new UnauthorizedError('Invalid refresh token');
        }

        // Verify user exists
        const user = await this.authRepository.findById(decoded.userId);
        if (!user) {
            throw new UnauthorizedError('User not found');
        }

        const accessToken = this.jwtService.generateAccessToken(decoded.userId);

        return { accessToken };
    }

    async logoutUser(refreshToken: string): Promise<void> {
        await this.authRepository.revokeRefreshToken(refreshToken);
    }
}