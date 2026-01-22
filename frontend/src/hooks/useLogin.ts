import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLoginMutation } from "@/lib/store/services/auth/authApi";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";
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
            const response = await login({
                email: data.email,
                password: data.password,
            }).unwrap();

            toast.success("Welcome Back!", {
                description: "You have successfully logged in.",
                duration: 3000,
            });

            if (response.data?.user?.hasCompletedOnboarding) {
                navigate("/dashboard");
            } else {
                navigate("/onboarding");
            }
        } catch (err) {
            console.error("Login failed", err);
        }
    };

    useEffect(() => {
        if (isError && error) {
            let errorMessage = "Something went wrong. Please try again.";
            let errorTitle = "Login Failed";

            if ('status' in error) {
                const status = error.status;

                if (status === 401) {
                    errorTitle = "Invalid Credentials";
                    errorMessage = "The email or password you entered is incorrect.";
                } else if (status === 404) {
                    errorTitle = "Account Not Found";
                    errorMessage = "No account exists with this email. Please sign up.";
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
        onSubmit: form.handleSubmit(onSubmit),
    };
};
