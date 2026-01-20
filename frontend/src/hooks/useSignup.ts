import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSignUpMutation } from "@/lib/store/services/auth/authApi";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";
import type { SerializedError } from "@reduxjs/toolkit";
import type { SignupFormValues, BackendErrorData } from "@/types";

const signupSchema = z
    .object({
        userName: z.string().min(3, "Username must be at least 3 characters"),
        email: z.string().email("Please enter a valid email"),
        password: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

export const useSignup = () => {
    const [signUp, { isLoading, isError, error }] = useSignUpMutation();
    const navigate = useNavigate();

    const form = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            userName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: SignupFormValues) => {
        try {
            await signUp({
                email: data.email,
                password: data.password,
                userName: data.userName,
            }).unwrap();

            toast.success("Account created!", {
                description: "Please check your email to verify your account.",
            });
            navigate("/auth/verify-email");
        } catch (err) {
            console.error("Signup failed submission", err);
        }
    };

    useEffect(() => {
        if (isError && error) {
            let errorMessage = "Something went wrong. Please try again.";

            if ('data' in error) {
                const errorData = error.data as BackendErrorData;
                if (errorData?.message) {
                    errorMessage = errorData.message;
                }
            } else if ('message' in error) {
                const serializedError = error as SerializedError;
                if (serializedError.message) {
                    errorMessage = serializedError.message;
                }
            }

            toast.error("Signup failed", {
                description: errorMessage,
            });
        }
    }, [isError, error]);

    return {
        form,
        isLoading,
        onSubmit: form.handleSubmit(onSubmit),
    };
};
