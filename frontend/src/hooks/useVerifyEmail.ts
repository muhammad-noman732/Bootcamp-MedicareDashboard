import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useVerifyEmailMutation, useResendVerifyEmailMutation } from "@/lib/store/services/auth/authApi";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";
import type { VerifyEmailFormValues, BackendErrorData } from "@/types";

const verifySchema = z.object({
    otp: z.string().length(6, "Verification code must be 6 digits"),
});

export const useVerifyEmail = () => {
    const [verifyEmail, { isLoading, isError, error }] = useVerifyEmailMutation();
    const [resendEmail, { isLoading: isResending }] = useResendVerifyEmailMutation();
    const navigate = useNavigate();

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
                description: "Your account is now active. Welcome aboard!",
                duration: 4000,
            });

            navigate("/dashboard");
        } catch (err) {
            console.error("Verification failed", err);
        }
    };

    const handleResendOtp = async () => {
        try {
            await resendEmail({}).unwrap();
            toast.success("New Code Sent!", {
                description: "Please check your email for the new verification code.",
                duration: 4000,
            });
        } catch (err) {
            let errorMessage = "Failed to resend code. Please try again.";
            let errorTitle = "Resend Failed";
            const errorObj = err as { status?: number; data?: BackendErrorData };

            if (errorObj.status === 429) {
                errorTitle = "Too Many Requests";
                errorMessage = "Please wait before requesting a new code.";
            } else if (errorObj.status === 409) {
                errorTitle = "OTP Active";
                errorMessage = "A verification code is still active. Please wait or use the existing code.";
            }

            if (errorObj.data?.message) {
                errorMessage = errorObj.data.message;
            }

            toast.error(errorTitle, {
                description: errorMessage,
                duration: 5000,
            });
        }
    };

    useEffect(() => {
        if (isError && error) {
            let errorMessage = "Something went wrong. Please try again.";
            let errorTitle = "Verification Failed";

            if ('status' in error) {
                const status = error.status;

                if (status === 401) {
                    errorTitle = "Invalid Code";
                    errorMessage = "The verification code is incorrect or has expired.";
                } else if (status === 409) {
                    errorTitle = "Already Verified";
                    errorMessage = "Your email is already verified. You can login now.";
                } else if (status === 500) {
                    errorTitle = "Server Error";
                    errorMessage = "Our servers are having issues. Please try again later.";
                }

                if ('data' in error && error.data) {
                    const errorData = error.data as BackendErrorData;
                    if (errorData?.message) {
                        errorMessage = errorData.message;
                    }
                }
            }

            toast.error(errorTitle, {
                description: errorMessage,
                duration: 5000,
            });
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
