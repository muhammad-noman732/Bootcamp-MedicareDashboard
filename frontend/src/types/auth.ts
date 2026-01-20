import type { ApiResponse } from "./api";

export interface User {
    id: string;
    email: string;
    userName: string;
    name?: string;
    avatar?: string;
    isVerified: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}


export interface SignUpInput {
    userName: string;
    email: string;
    password: string;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface VerifyEmailInput {
    otp: string;
}

export interface GoogleLoginInput {
    idToken: string;
}

export interface ResendVerifyEmailInput { }


export interface AuthResponseData {
    user: User;
    accessToken: string;
    refreshToken: string;
}

export interface SignUpResponseData {
    email: string;
    userName: string;
}
export type LoginResponse = ApiResponse<AuthResponseData>;
export type SignUpResponse = ApiResponse<SignUpResponseData>;
export type VerifyEmailResponse = ApiResponse<AuthResponseData>;
export type GoogleLoginResponse = ApiResponse<AuthResponseData>;
export type ResendVerifyEmailResponse = ApiResponse<{ message: string }>;
