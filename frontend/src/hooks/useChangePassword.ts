import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useChangePasswordMutation } from "@/lib/store/services/auth/authApi";
import { toast } from "sonner";
import { useEffect } from "react";
import type { ChangePasswordInput } from "@/types/auth";
import type { BackendErrorData } from "@/types";

const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters long"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "New password and confirm password do not match",
    path: ["confirmPassword"],
});

export const useChangePassword = () => {
    const [changePassword, { isLoading, isError, error }] = useChangePasswordMutation();

    const form = useForm<ChangePasswordInput>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: ChangePasswordInput) => {
        try {
            await changePassword(data).unwrap();

            form.reset();

            toast.success("Password Changed", {
                description: "Your password has been successfully updated.",
            });
        } catch (err) {
            toast.error("Error", {
                description: "Failed to change password.",
            });
        }
    };

    useEffect(() => {
        if (isError && error) {
            let errorMessage = "Failed to change password";
            if ('data' in error && error.data) {
                const errorData = error.data as BackendErrorData;
                if (errorData.message) {
                    errorMessage = errorData.message;
                }
            }
            toast.error("Error", {
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