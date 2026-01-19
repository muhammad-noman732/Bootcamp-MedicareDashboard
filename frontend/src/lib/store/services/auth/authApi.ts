import type {
    LoginInput,
    LoginResponse,
    SignUpInput,
    SignUpResponse,
    VerifyEmailInput,
    VerifyEmailResponse,
    ResendVerifyEmailInput,
    ResendVerifyEmailResponse,
    GoogleLoginInput,
    GoogleLoginResponse,
    AuthResponseData,
} from "@/types/auth";
import { api } from "../api";
import type { ApiResponse } from "@/types/api";

export const authApi = api.injectEndpoints({
    endpoints: (builder) => ({
        signUp: builder.mutation<SignUpResponse, SignUpInput>({
            query: (credentials) => ({
                url: "/auth/signup",
                method: "POST",
                body: credentials,
            }),
        }),

        login: builder.mutation<LoginResponse, LoginInput>({
            query: (credentials) => ({
                url: "/auth/login",
                method: "POST",
                body: credentials,
            }),
            invalidatesTags: ["User"],
        }),

        googleLogin: builder.mutation<GoogleLoginResponse, GoogleLoginInput>({
            query: (data) => ({
                url: "/auth/google",
                method: "POST",
                body: data
            }),
            invalidatesTags: ["User"],
        }),

        getCurrentUser: builder.query<ApiResponse<AuthResponseData>, void>({
            query: () => "/users/me", // Adjusted to standard convention
            providesTags: ["User"],
        }),

        logout: builder.mutation<void, void>({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
            }),
            invalidatesTags: ["User"],
        }),

        verifyEmail: builder.mutation<VerifyEmailResponse, VerifyEmailInput>({
            query: (data) => ({
                url: "/auth/verify-email",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["User"],
        }),

        resendVerifyEmail: builder.mutation<ResendVerifyEmailResponse, ResendVerifyEmailInput>({
            query: (data) => ({
                url: "/auth/resend-verification",
                method: "POST",
                body: data,
            }),
        }),
    }),
});

export const {
    useSignUpMutation,
    useLoginMutation,
    useGoogleLoginMutation,
    useGetCurrentUserQuery,
    useLogoutMutation,
    useVerifyEmailMutation,
    useResendVerifyEmailMutation
} = authApi;