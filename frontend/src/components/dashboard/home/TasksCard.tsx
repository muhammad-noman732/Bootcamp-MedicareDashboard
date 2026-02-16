import { Check, MoreHorizontal, Plus, Edit, Trash2 } from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader2 } from "lucide-react";
import { CreateTaskModal } from "../tasks/modals/CreateTaskModal";
import { UpdateTaskModal } from "../tasks/modals/UpdateTaskModal";
import { DeleteTaskModal } from "../tasks/modals/DeleteTaskModal";
import { cn } from "@/lib/utils";
import { useTasksCard } from "@/hooks/useTasksCard";

const formatDate = (dateString: string | null): string => {
    if (!dateString) return "No date";
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    } catch {
        return "Invalid date";
    }
};

export function TasksCard() {
    const {
        tasks,
        isLoading,
        isToggling,
        onToggleTask,
        isCreateModalOpen,
        openCreateModal,
        closeCreateModal,
        selectedTask,
        isUpdateModalOpen,
        openUpdateModal,
        closeUpdateModal,
        isDeleteModalOpen,
        openDeleteModal,
        closeDeleteModal,
        viewAllTasks
    } = useTasksCard();

    return (
        <Card className="flex-1 max-w-[570px] min-h-[611.91px] rounded-[4.9px] border-0 bg-white p-6 shadow-[0px_1.96px_15.69px_rgba(0,0,0,0.03)]">
            <CardHeader className="flex flex-row items-center justify-between h-[30px] px-0 pt-0 mb-6">


                <CardTitle className="text-base font-bold leading-[100%] tracking-[0.25%] text-dark font-mukta">
                    Tasks
                </CardTitle>

                <Button
                    variant="ghost"
                    onClick={openCreateModal}
                    className="flex items-center gap-2 text-primary hover:text-primary hover:bg-transparent p-0 h-auto"
                >
                    <span className="text-[12.75px] font-semibold leading-[100%] tracking-[0.4%] text-primary font-mukta">
                        New Tasks
                    </span>
                    <div className="relative flex items-center justify-center w-[24px] h-[24px] rounded border-[0.72px] border-border ">
                        <div className="w-[12px] h-[12px] flex items-center justify-center">
                            <Plus size={10} className="text-primary " strokeWidth={2.5} />
                        </div>
                    </div>
                </Button>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 px-0 pt-0">
                {isLoading ? (
                    <div className="flex items-center justify-center py-10">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="text-center py-10 text-sm text-muted-foreground">
                        No tasks yet
                    </div>
                ) : (
                    <>
                        <div className="space-y-3">
                            {tasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="flex items-start gap-4 p-4 min-h-[100px] rounded-lg bg-muted/30 border-[0.98px] border-border transition-all hover:border-primary/20 font-mukta"
                                >
                                    <button
                                        onClick={() => onToggleTask(task.id, !task.isCompleted, task.title)}
                                        disabled={isToggling}
                                        className="flex-shrink-0 mt-1 focus:outline-none"
                                    >
                                        {task.isCompleted ? (
                                            <div className="flex items-center justify-center w-[31.38002197504261px] h-[31.38002006769375px] rounded-[5.88px] bg-status-blue">
                                                <Check size={18} className="text-white" strokeWidth={3} />
                                            </div>
                                        ) : (
                                            <div className="w-[31.38002197504261px] h-[31.38002006769375px] rounded-[5.88px] border-[0.98px] border-border bg-white hover:border-primary transition-colors" />
                                        )}
                                    </button>
                                    <div className="flex-1 min-w-0">
                                        <div className={cn(
                                            "text-[15.69px] font-bold leading-[100%] tracking-[0.25%] mb-1 transition-all font-mukta",
                                            task.isCompleted ? "text-gray-3 line-through" : "text-dark"
                                        )}>
                                            {task.title}
                                        </div>
                                        <p className={cn(
                                            "text-sm leading-relaxed truncate font-mukta",
                                            task.isCompleted ? "text-gray-4" : "text-gray-2"
                                        )}>
                                            {task.description || task.title}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4 flex-shrink-0 self-center">
                                        <span className="text-sm text-gray-3 whitespace-nowrap font-mukta">
                                            {formatDate(task.date)}
                                        </span>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button className="relative flex items-center justify-center w-[24px] h-[24px] rounded border-[0.72px] border-border bg-white p-0 hover:bg-muted/50 transition-colors">
                                                    <MoreHorizontal size={18} className="text-status-blue" />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-40">
                                                <DropdownMenuItem
                                                    onClick={() => openUpdateModal(task)}
                                                >
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-destructive focus:text-destructive"
                                                    onClick={() => openDeleteModal(task)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end mt-2">
                            <button
                                onClick={viewAllTasks}
                                className="flex items-center gap-1 text-[13px] font-semibold text-primary hover:underline font-mukta"
                            >
                                <span>View all</span>
                                <span className="text-primary inline-flex">›</span>
                            </button>
                        </div>
                    </>
                )}
            </CardContent>

            <CreateTaskModal
                isOpen={isCreateModalOpen}
                onClose={closeCreateModal}
            />

            {selectedTask && (
                <>
                    <UpdateTaskModal
                        isOpen={isUpdateModalOpen}
                        onClose={closeUpdateModal}
                        taskId={selectedTask.id}
                    />
                    <DeleteTaskModal
                        isOpen={isDeleteModalOpen}
                        onClose={closeDeleteModal}
                        taskId={selectedTask.id}
                        taskTitle={selectedTask.title}
                    />
                </>
            )}
        </Card>
    );
}