import { useToggleTaskCompletionMutation } from "@/lib/store/services/task/taskApi";
import { toast } from "sonner";

export const useToggleTask = () => {
    const [toggleTask, { isLoading }] = useToggleTaskCompletionMutation();

    const handleToggle = async (
        taskId: string,
        isCompleted: boolean,
        taskTitle: string,
        onSuccess?: () => void
    ) => {
        try {
            await toggleTask({ id: taskId, isCompleted }).unwrap();
            toast.success(isCompleted ? "Task Completed" : "Task Marked as Pending", {
                description: `"${taskTitle}" has been ${isCompleted ? "completed" : "marked as pending"}.`,
                duration: 4000,
            });
            if (onSuccess) onSuccess();
        } catch (error) {
            toast.error("Update Failed", {
                description: "Something went wrong while updating the task.",
                duration: 5000,
            });
        }
    };

    return {
        handleToggle,
        isLoading,
    };
};
