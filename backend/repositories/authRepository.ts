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
                name: true,
                avatar: true,
                companyName: true,
                industry: true,
                employeeCount: true,
                specialty: true,
                phoneNumber: true,
                bio: true,
                address: true,
                isVerified: true,
                isActive: true,
                hasCompletedOnboarding: true,
                createdAt: true,
                updatedAt: true
            }
        });
    }

    async findByIdWithVerification(id: string) {
        return prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                userName: true,
                email: true,
                isVerified: true,
                isActive: true,
                hasCompletedOnboarding: true
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
                name: true,
                avatar: true,
                companyName: true,
                industry: true,
                employeeCount: true,
                specialty: true,
                phoneNumber: true,
                bio: true,
                address: true,
                isVerified: true,
                isActive: true,
                hasCompletedOnboarding: true,
                createdAt: true,
                updatedAt: true
            }
        });
    }

    async findByUserName(userName: string): Promise<AuthUserResponse | null> {
        return prisma.user.findFirst({
            where: { userName },
            select: {
                id: true,
                userName: true,
                email: true,
                name: true,
                avatar: true,
                companyName: true,
                industry: true,
                employeeCount: true,
                specialty: true,
                phoneNumber: true,
                bio: true,
                address: true,
                isVerified: true,
                isActive: true,
                hasCompletedOnboarding: true,
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

    async findByIdWithPassword(id: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { id }
        });
    }

    async updateUserProfile(id: string, data: Prisma.UserUpdateInput): Promise<AuthUserResponse> {
        return prisma.user.update({
            where: { id },
            data,
            select: {
                id: true,
                userName: true,
                email: true,
                name: true,
                avatar: true,
                companyName: true,
                industry: true,
                employeeCount: true,
                specialty: true,
                phoneNumber: true,
                bio: true,
                address: true,
                isVerified: true,
                isActive: true,
                hasCompletedOnboarding: true,
                createdAt: true,
                updatedAt: true
            }
        });
    }

    async completeOnboarding(userId: string, data: Prisma.UserUpdateInput): Promise<AuthUserResponse> {
        return prisma.user.update({
            where: { id: userId },
            data: {
                ...data,
                hasCompletedOnboarding: true
            },
            select: {
                id: true,
                userName: true,
                email: true,
                name: true,
                avatar: true,
                companyName: true,
                industry: true,
                employeeCount: true,
                specialty: true,
                phoneNumber: true,
                bio: true,
                address: true,
                isVerified: true,
                isActive: true,
                hasCompletedOnboarding: true,
                createdAt: true,
                updatedAt: true
            }
        });
    }

    async findByGoogleId(googleId: string): Promise<User | null> {
        return prisma.user.findFirst({
            where: { googleId }
        });
    }

    async updateUser(id: string, data: Prisma.UserUpdateInput): Promise<User> {
        return prisma.user.update({
            where: { id },
            data,
        });
    }

    async createUser(data: Prisma.UserCreateInput): Promise<AuthUserResponse | null> {
        return prisma.user.create({
            data,
            select: {
                id: true,
                userName: true,
                email: true,
                name: true,
                avatar: true,
                companyName: true,
                industry: true,
                employeeCount: true,
                specialty: true,
                phoneNumber: true,
                bio: true,
                address: true,
                isVerified: true,
                isActive: true,
                hasCompletedOnboarding: true,
                createdAt: true,
                updatedAt: true
            }
        });
    }

    async createRefreshToken(userId: string, tokenHash: string, expiresAt: Date): Promise<RefreshToken> {
        return prisma.refreshToken.create({
            data: {
                userId,
                tokenHash,
                expiresAt,
            }
        });
    }

    async findRefreshToken(tokenHash: string): Promise<RefreshToken | null> {
        return prisma.refreshToken.findUnique({
            where: { tokenHash }
        });
    }

    async revokeRefreshToken(tokenHash: string): Promise<RefreshToken> {
        return prisma.refreshToken.delete({
            where: { tokenHash }
        });
    }

    async revokeRefreshTokensByUserId(userId: string): Promise<Prisma.BatchPayload> {
        return prisma.refreshToken.deleteMany({
            where: { userId }
        });
    }

    async createEmailVerification(userId: string, hashedOTP: string, expiresAt: Date, invalidateOld: boolean = false): Promise<void> {
        if (invalidateOld) {
            await prisma.emailVerification.updateMany({
                where: {
                    userId,
                    usedAt: null
                },
                data: {
                    expiresAt: new Date()
                }
            });
        }

        await prisma.emailVerification.create({
            data: {
                userId,
                hashedOtp: hashedOTP,
                expiresAt
            }
        });
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

    async deleteUserById(userId: string): Promise<void> {
        await prisma.user.delete({
            where: { id: userId },
        });
    }
}


