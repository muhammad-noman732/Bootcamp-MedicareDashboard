import type { SignUpInput, SignUpResponse } from "@/types/auth";
import { api } from "../api";



export const authApi = api.injectEndpoints({
    endpoints: (builder) => ({
        SignUp: builder.mutation<SignUpResponse, SignUpInput>({
            query: (credientals) => ({
                url: 'auth/signup',
                method: 'POST',
                body: credientals
            }),
            invalidatesTags: ["User"]
        }),

        getCurrentUser: builder.query({
            query: () => 'auth/getCurrentUser',
            providesTags: ["User"]
        })
    })
})