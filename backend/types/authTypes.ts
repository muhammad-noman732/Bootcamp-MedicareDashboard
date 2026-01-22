import type { User } from "../generated/prisma/client";

export type AuthUserResponse = Pick<User, 'id' | 'email' | 'userName' | 'isVerified' | 'isActive' | 'hasCompletedOnboarding' | 'createdAt' | 'updatedAt'>;

export interface AuthResponse {
    user: AuthUserResponse;
    accessToken: string;
    refreshToken?: string;
}
