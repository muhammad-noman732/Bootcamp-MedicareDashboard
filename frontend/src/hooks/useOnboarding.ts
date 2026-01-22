import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCompleteOnboardingMutation, useGetCurrentUserQuery } from "@/lib/store/services/auth/authApi";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";
import type { BackendErrorData } from "@/types";

const onboardingSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    companyName: z.string().min(3, "Company name must be at least 3 characters long"),
    industry: z.string().min(3, "Industry must be at least 3 characters long"),
    employeeCount: z.string().min(1, "Employee count is required"),
    specialty: z.string().optional(),
});

export type OnboardingFormValues = z.infer<typeof onboardingSchema>;

export const useOnboarding = () => {
    const [completeOnboarding, { isLoading, isError, error }] = useCompleteOnboardingMutation();
    const { refetch } = useGetCurrentUserQuery();
    const navigate = useNavigate();

    const form = useForm<OnboardingFormValues>({
        resolver: zodResolver(onboardingSchema),
        defaultValues: {
            name: "",
            companyName: "",
            industry: "",
            employeeCount: "",
            specialty: "",
        },
    });

    const onSubmit = async (data: OnboardingFormValues) => {
        try {
            await completeOnboarding({
                name: data.name,
                companyName: data.companyName,
                industry: data.industry,
                employeeCount: data.employeeCount,
                specialty: data.specialty,
            }).unwrap();

            toast.success("Onboarding Complete!", {
                description: "Welcome to Medicare Dashboard!",
                duration: 3000,
            });

            const { data: updatedUser } = await refetch();

            if (updatedUser?.data?.hasCompletedOnboarding) {
                navigate("/dashboard", { replace: true });
            }
        } catch (err) {
            console.error("Onboarding failed", err);
        }
    };

    useEffect(() => {
        if (isError && error) {
            let errorMessage = "Something went wrong. Please try again.";
            let errorTitle = "Onboarding Failed";

            if ('status' in error) {
                const status = error.status;

                if (status === 400) {
                    errorTitle = "Invalid Data";
                    errorMessage = "Please check your information and try again.";
                } else if (status === 401) {
                    errorTitle = "Unauthorized";
                    errorMessage = "Please login again.";
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
