import { Prisma, type User, type RefreshToken } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";

export class AuthRepository {
    async findById(id: string): Promise<Partial<User> | null> {
        return prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                userName: true,
                email: true,
                createdAt: true,
                updatedAt: true
            }
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { email }
        });
    }

    async createUser(data: Prisma.UserCreateInput): Promise<User> {
        return prisma.user.create({
            data,
        });
    }

    // Refresh Token Methods
    async createRefreshToken(userId: string, token: string, expiresAt: Date, ipAddress?: string): Promise<RefreshToken> {
        return prisma.refreshToken.create({
            data: {
                userId,
                token,
                expiresAt,

            }
        });
    }

    async findRefreshToken(token: string): Promise<RefreshToken | null> {
        return prisma.refreshToken.findUnique({
            where: { token }
        });
    }

    async revokeRefreshToken(token: string): Promise<RefreshToken> {
        return prisma.refreshToken.delete({
            where: { token }
        });
    }

    async revokeRefreshTokensByUserId(userId: string): Promise<Prisma.BatchPayload> {
        return prisma.refreshToken.deleteMany({
            where: { userId }
        });
    }
}