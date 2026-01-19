
export interface User {
    id: string;
    email: string;
    userName: string;
    createdAt: string;
    updatedAt: string;
}

export interface ApiResponse<T> {
    status: "success" | "error" | "fail";
    message: string;
    data: T;
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
    email: string;
    otp: string;
}

export interface GoogleLoginInput {
    idToken: string;
}

export interface AuthResponseData {
    user: User;
    accessToken: string;
}

export interface SignUpResponseData {
    email: string;
    userName: string;
}


export type LoginResponse = ApiResponse<AuthResponseData>;
export type SignUpResponse = ApiResponse<SignUpResponseData>;
export type VerifyEmailResponse = ApiResponse<AuthResponseData>;
export type GoogleLoginResponse = ApiResponse<AuthResponseData>;

