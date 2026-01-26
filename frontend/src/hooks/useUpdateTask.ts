import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUpdateTaskMutation, useGetTaskQuery } from "@/lib/store/services/task/taskApi";
import { useEffect } from "react";
import { toast } from "sonner";
import type { BackendErrorData } from "@/types";
import type { CreateTaskFormValues } from "./useCreateTask";

const updateTaskSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().optional(),
    date: z.string().optional(),
    status: z.boolean().optional(),
    statusText: z.string().optional(),
});

export type UpdateTaskFormValues = z.infer<typeof updateTaskSchema>;

interface UseUpdateTaskProps {
    taskId: string;
    isOpen: boolean;
    onSuccess?: () => void;
}

export const useUpdateTask = ({ taskId, isOpen, onSuccess }: UseUpdateTaskProps) => {
    const { data: taskData, isLoading: isFetching } = useGetTaskQuery(taskId, {
        skip: !isOpen || !taskId,
    });

    const [updateTask, { isLoading: isUpdating, isError, error }] = useUpdateTaskMutation();

    const form = useForm<CreateTaskFormValues>({
        resolver: zodResolver(updateTaskSchema),
        defaultValues: {
            title: "",
            description: "",
            date: "",
            status: false,
            statusText: "",
        },
    });

    useEffect(() => {
        if (taskData?.data) {
            const task = taskData.data;
            form.reset({
                title: task.title,
                description: task.description || "",
                date: task.date ? new Date(task.date).toISOString().split("T")[0] : "",
                status: task.status ?? false,
                statusText: task.statusText || "",
            });
        }
    }, [taskData, form]);

    const onSubmit = async (data: CreateTaskFormValues) => {
        try {
            await updateTask({
                id: taskId,
                data: {
                    title: data.title,
                    description: data.description,
                    date: data.date,
                    status: data.status,
                    statusText: data.statusText,
                },
            }).unwrap();

            toast.success("Task Updated", {
                description: "The task has been updated successfully.",
                duration: 4000,
            });
            onSuccess?.();
        } catch (err) {
            toast.error("Error", {
                description: "Failed to update profile.",
            });
        }
    };

    useEffect(() => {
        if (isError && error) {
            let errorMessage = "Something went wrong. Please try again.";
            let errorTitle = "Failed to Update Task";

            if ("status" in error) {
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

                if ("data" in error && error.data) {
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
        isFetching,
        isUpdating,
        onSubmit: form.handleSubmit(onSubmit),
    };
};
