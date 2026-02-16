import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useResetPasswordMutation } from "@/lib/store/services/auth/authApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";
import type { BackendErrorData } from "@/types";

const resetPasswordSchema = z
    .object({
        newPassword: z.string().min(8, "Password must be at least 8 characters long"),
        confirmPassword: z.string().min(1, "Confirm password is required"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const useResetPassword = () => {
    const [resetPassword, { isLoading, isError, error, isSuccess }] = useResetPasswordMutation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const token = searchParams.get("token");

    const form = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: ResetPasswordFormValues) => {
        if (!token) {
            toast.error("Error", {
                description: "Invalid or missing reset token",
                duration: 3000,
            });
            return;
        }

        try {
            await resetPassword({
                token,
                newPassword: data.newPassword,
                confirmPassword: data.confirmPassword,
            }).unwrap();

            toast.success("Password Reset Successful!", {
                description: "Your password has been reset. You can now login with your new password.",
                duration: 5000,
            });

            form.reset();

            setTimeout(() => {
                navigate("/auth/login");
            }, 2000);
        } catch (err) {
            toast.error("Error", {
                description: "Failed to reset password.",
            });
        }
    };

    useEffect(() => {
        if (isError && error) {
            const errorData = error as { data?: BackendErrorData };
            const message = errorData?.data?.message || "Failed to reset password";
            toast.error("Error", {
                description: message,
                duration: 3000,
            });
        }
    }, [isError, error]);

    useEffect(() => {
        if (!token) {
            toast.error("Error", {
                description: "Invalid reset link. Please request a new password reset.",
                duration: 3000,
            });
            navigate("/auth/forgot-password");
        }
    }, [token, navigate]);

    return {
        form,
        onSubmit: form.handleSubmit(onSubmit),
        isLoading,
        isSuccess,
        token,
    };
};