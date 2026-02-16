import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { TaskForm } from "../forms/TaskForm";
import { useUpdateTask } from "@/hooks/useUpdateTask";
import { Loader2 } from "lucide-react";

interface UpdateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    taskId: string;
}

export function UpdateTaskModal({
    isOpen,
    onClose,
    taskId,
}: UpdateTaskModalProps) {
    const { form, isFetching, isUpdating, onSubmit } = useUpdateTask({
        taskId,
        isOpen,
        onSuccess: onClose,
    });

    const {
        register,
        formState: { errors },
        setValue,
        watch,
    } = form;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-[#1D1D1D]">
                        Update Task
                    </DialogTitle>
                </DialogHeader>

                {isFetching ? (
                    <div className="flex items-center justify-center py-10">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <>
                        <form onSubmit={onSubmit} className="space-y-4 py-4">
                            <TaskForm
                                register={register}
                                errors={errors}
                                setValue={setValue}
                                watch={watch}
                                isLoading={isUpdating}
                            />

                            <div className="flex justify-end gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                    disabled={isUpdating}
                                    className="border-primary text-primary"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="bg-primary hover:bg-primary/90 min-w-[100px]"
                                >
                                    {isUpdating ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        "Update Task"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}