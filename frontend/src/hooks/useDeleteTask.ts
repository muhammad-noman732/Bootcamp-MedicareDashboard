import { useDeleteTaskMutation } from "@/lib/store/services/task/taskApi";
import { toast } from "sonner";

export const useDeleteTask = () => {
    const [deleteTask, { isLoading }] = useDeleteTaskMutation();

    const handleDelete = async (taskId: string, taskTitle: string, onSuccess?: () => void) => {
        try {
            await deleteTask(taskId).unwrap();
            toast.success("Task Deleted", {
                description: `"${taskTitle}" has been deleted successfully.`,
                duration: 4000,
            });
            if (onSuccess) onSuccess();
        } catch (error) {
            toast.error("Delete Failed", {
                description: "Something went wrong while deleting the task.",
                duration: 5000,
            });
        }
    };

    return {
        handleDelete,
        isLoading,
    };
};