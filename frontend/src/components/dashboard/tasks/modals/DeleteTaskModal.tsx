import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { useDeleteTask } from "@/hooks/useDeleteTask";

interface DeleteTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    taskId: string;
    taskTitle: string;
}

export function DeleteTaskModal({
    isOpen,
    onClose,
    taskId,
    taskTitle,
}: DeleteTaskModalProps) {
    const { handleDelete, isLoading } = useDeleteTask();

    const onConfirm = () => {
        handleDelete(taskId, taskTitle, onClose);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-[#1D1D1D]">
                        Delete Task
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete "{taskTitle}"? This action
                        cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex justify-end gap-3 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                        className="border-primary text-primary"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="bg-[#EB5757] hover:bg-[#EB5757]/90 text-white min-w-[100px]"
                    >
                        {isLoading ? "Deleting..." : "Delete"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}