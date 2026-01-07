import { Prisma, type User, type RefreshToken } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";
import type { AuthResponse, AuthUserResponse } from "../types/authTypes";

export class AuthRepository {

    async findById(id: string): Promise<AuthUserResponse | null> {
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

    async findByEmail(email: string): Promise<AuthUserResponse | null> {
        return prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                userName: true,
                email: true,
                createdAt: true,
                updatedAt: true
            }
        });
    }

    async findByEmailWithPassword(email: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { email }
        });
    }

    async createUser(data: Prisma.UserCreateInput): Promise<AuthUserResponse | null> {
        return prisma.user.create({
            data,
            select: {
                id: true,
                userName: true,
                email: true,
                createdAt: true,
                updatedAt: true
            }
        });
    }

    // Refresh Token Methods

    async createRefreshToken(userId: string, tokenHash: string, expiresAt: Date): Promise<RefreshToken> {
        return prisma.refreshToken.create({
            data: {
                userId,
                tokenHash,
                expiresAt,
            }
        });
    }

    // to find refresh token
    async findRefreshToken(tokenHash: string): Promise<RefreshToken | null> {
        return prisma.refreshToken.findUnique({
            where: { tokenHash }
        });
    }

    // to delete from single account(logout)
    async revokeRefreshToken(tokenHash: string): Promise<RefreshToken> {
        return prisma.refreshToken.delete({
            where: { tokenHash }
        });
    }

    // to delete from all accounts (change password , logout)
    async revokeRefreshTokensByUserId(userId: string): Promise<Prisma.BatchPayload> {
        return prisma.refreshToken.deleteMany({
            where: { userId }
        });
    }


    async createEmailVerification(userId: string, hashedOTP: string, expiresAt: Date, invalidateOld: boolean = false): Promise<void> {
        console.log(`[createEmailVerification] Creating OTP for user ${userId}, expiresAt: ${expiresAt}, invalidateOld: ${invalidateOld}`);

        if (invalidateOld) {
            const updateResult = await prisma.emailVerification.updateMany({
                where: {
                    userId,
                    usedAt: null
                },
                data: {
                    expiresAt: new Date()
                }
            });
            console.log(`[createEmailVerification] Invalidated ${updateResult.count} old OTPs`);
        }

        await prisma.emailVerification.create({
            data: {
                userId,
                hashedOtp: hashedOTP,
                expiresAt
            }
        });
        console.log(`[createEmailVerification] New OTP created`);
    }

    async findEmailVerification(userId: string) {

        const latestVerification = await prisma.emailVerification.findFirst({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });

        if (!latestVerification) {
            return null;
        }

        if (latestVerification.usedAt !== null) {
            return null;
        }

        return latestVerification;
    }

    async findPendingEmailVerification(userId: string) {
        return await prisma.emailVerification.findFirst({
            where: {
                userId,
                usedAt: null,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async incrementVerificationAttempts(id: string): Promise<void> {
        await prisma.emailVerification.update({
            where: { id },
            data: {
                attempts: { increment: 1 },
            },
        });
    }

    async markVerificationAsUsed(id: string): Promise<void> {
        await prisma.emailVerification.update({
            where: { id },
            data: {
                usedAt: new Date(),
            },
        });
    }



    async markUserAsVerified(userId: string): Promise<void> {
        await prisma.user.update({
            where: { id: userId },
            data: {
                isVerified: true,
            },
        });
    }

}