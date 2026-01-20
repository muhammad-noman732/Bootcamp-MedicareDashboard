import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLoginMutation } from "@/lib/store/services/auth/authApi";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";
import type { SerializedError } from "@reduxjs/toolkit";
import type { LoginFormValues, BackendErrorData } from "@/types";

const loginSchema = z.object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(1, "Password is required"),
});

export const useLogin = () => {
    const [login, { isLoading, isError, error }] = useLoginMutation();
    const navigate = useNavigate();

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginFormValues) => {
        try {
            await login({
                email: data.email,
                password: data.password,
            }).unwrap();

            toast.success("Welcome back!", {
                description: "You have successfully logged in.",
            });

            navigate("/dashboard");
        } catch (err) {
            console.error("Login failed", err);
        }
    };

    useEffect(() => {
        if (isError && error) {
            let errorMessage = "Login failed. Please try again.";

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

            toast.error("Login failed", {
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
