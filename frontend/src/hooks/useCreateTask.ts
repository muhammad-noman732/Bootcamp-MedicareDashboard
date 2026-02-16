import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateTaskMutation } from "@/lib/store/services/task/taskApi";
import { useEffect } from "react";
import { toast } from "sonner";
import type { BackendErrorData } from "@/types";

const createTaskSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().optional(),
    date: z.string().optional(),
    status: z.boolean().optional(),
    statusText: z.string().optional(),
});

export type CreateTaskFormValues = z.infer<typeof createTaskSchema>;

interface UseCreateTaskProps {
    onSuccess?: () => void;
}

export const useCreateTask = ({ onSuccess }: UseCreateTaskProps = {}) => {
    const [createTask, { isLoading, isError, error }] = useCreateTaskMutation();

    const form = useForm<CreateTaskFormValues>({
        resolver: zodResolver(createTaskSchema),
        defaultValues: {
            title: "",
            description: "",
            date: new Date().toISOString().split("T")[0],
            status: false,
            statusText: "",
        },
    });

    const onSubmit = async (data: CreateTaskFormValues) => {
        try {
            await createTask({
                title: data.title,
                description: data.description,
                date: data.date,
                status: data.status,
                statusText: data.statusText,
            }).unwrap();

            toast.success("Task Created", {
                description: "The task has been added successfully.",
                duration: 4000,
            });

            form.reset();

            if (onSuccess) onSuccess();
        } catch (err) {
            toast.error("Error", {
                description: "Failed to create task.",
            });
        }
    };

    useEffect(() => {
        if (isError && error) {
            let errorMessage = "Something went wrong. Please try again.";
            let errorTitle = "Failed to Create Task";

            if ('status' in error) {
                const status = error.status;

                if (status === 400) {
                    errorTitle = "Invalid Data";
                    errorMessage = "Please check the form fields and try again.";
                } else if (status === 401) {
                    errorTitle = "Session Expired";
                    errorMessage = "Please login again to continue.";
                } else if (status === 500) {
                    errorTitle = "Server Error";
                    errorMessage = "Our servers are having issues. Please try again later.";
                }

                if ('data' in error && error.data) {
                    const errorData = error.data as BackendErrorData;
                    if (errorData.message) errorMessage = errorData.message;
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