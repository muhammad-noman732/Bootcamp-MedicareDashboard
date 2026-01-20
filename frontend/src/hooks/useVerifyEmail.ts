import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useVerifyEmailMutation, useResendVerifyEmailMutation } from "@/lib/store/services/auth/authApi";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";
import type { SerializedError } from "@reduxjs/toolkit";
import type { VerifyEmailFormValues, BackendErrorData } from "@/types";

export const useVerifyEmail = () => {
    const [verifyEmail, { isLoading, isError, error }] = useVerifyEmailMutation();
    const [resendEmail, { isLoading: isResending }] = useResendVerifyEmailMutation();
    const navigate = useNavigate();

    const verifySchema = z.object({
        otp: z.string().length(6, "Verification code must be 6 digits"),
    });

    const form = useForm<VerifyEmailFormValues>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            otp: "",
        },
    });

    const onSubmit = async (data: VerifyEmailFormValues) => {
        try {
            await verifyEmail({
                otp: data.otp,
            }).unwrap();

            toast.success("Email Verified!", {
                description: "Your account is now active.",
            });

            navigate("/dashboard");

        } catch (err) {
            console.error("Verification failed", err);
        }
    };

    const handleResendOtp = async () => {
        try {
            await resendEmail({}).unwrap();
            toast.success("New code sent!", {
                description: "Please check your email for the new verification code.",
            });
        } catch (err) {
            let errorMessage = "Failed to resend code. Please try again.";
            const errorObj = err as { data?: BackendErrorData; message?: string };

            if (errorObj.data?.message) {
                errorMessage = errorObj.data.message;
            } else if (errorObj?.message) {
                errorMessage = errorObj.message;
            }

            toast.error("Error", { description: errorMessage });
        }
    };

    useEffect(() => {
        if (isError && error) {
            let errorMessage = "Verification failed. Please try again.";
            if ("data" in error) {
                const errorData = error.data as BackendErrorData;
                if (errorData?.message) errorMessage = errorData.message;
            } else if ("message" in error) {
                const serializedError = error as SerializedError;
                if (serializedError.message) errorMessage = serializedError.message;
            }
            toast.error("Error", { description: errorMessage });
        }
    }, [isError, error]);

    return {
        form,
        isLoading,
        isResending,
        onSubmit: form.handleSubmit(onSubmit),
        handleResendOtp,
    };
};
