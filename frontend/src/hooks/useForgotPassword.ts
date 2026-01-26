import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForgotPasswordMutation } from "@/lib/store/services/auth/authApi";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";
import type { BackendErrorData } from "@/types";

const forgotPasswordSchema = z.object({
    email: z.string().email("Please enter a valid email"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const useForgotPassword = () => {
    const [forgotPassword, { isLoading, isError, error }] = useForgotPasswordMutation();
    const navigate = useNavigate();

    const form = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = async (data: ForgotPasswordFormValues) => {
        try {
            const response = await forgotPassword({
                email: data.email,
            }).unwrap();

            toast.success("Check Your Email!", {
                description: "Password reset link sent to your email. Please check your inbox.",
                duration: 5000,
            });

            form.reset();

            // Show helpful message
            setTimeout(() => {
                toast.info("Didn't receive the email?", {
                    description: "Check your spam folder or try again in a moment.",
                    duration: 4000,
                });
            }, 1000);
        } catch (err) {
            console.error("Forgot password failed", err);
        }
    };

    useEffect(() => {
        if (isError && error) {
            const errorData = error as { data?: BackendErrorData };
            const message = errorData?.data?.message || "Failed to send reset email";
            toast.error("Error", {
                description: message,
                duration: 3000,
            });
        }
    }, [isError, error]);

    return {
        form,
        onSubmit: form.handleSubmit(onSubmit),
        isLoading,
    };
};
