import { Check, Calendar } from "lucide-react";
import { TaskActions } from "./TaskActions";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/task";

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

type TaskItemProps = {
    task: Task;
    onToggle: (id: string, isCompleted: boolean) => void;
    onEdit: (task: Task) => void;
    onDelete: (id: string, title: string) => void;
};

export function TaskItem({ task, onToggle, onEdit, onDelete }: TaskItemProps) {
    const formattedDate = formatDate(task.date);

    const handleToggle = () => {
        onToggle(task.id, !task.isCompleted);
    };

    return (
        <div
            className={cn(
                "flex items-start gap-4 p-4 min-h-[100px] rounded-lg bg-muted/30 border-[0.98px] border-border font-mukta",
                "hover:bg-muted/50 transition-colors"
            )}
        >
            <div className="flex-shrink-0 pt-1">
                <button
                    type="button"
                    onClick={handleToggle}
                    className={cn(
                        "flex items-center justify-center w-[31px] h-[31px] rounded-[6px] transition-colors",
                        task.isCompleted
                            ? "bg-status-blue hover:bg-status-blue/90"
                            : "border-[0.98px] border-gray-5 bg-white hover:bg-muted"
                    )}
                    aria-label={task.isCompleted ? "Mark as pending" : "Mark as completed"}
                >
                    {task.isCompleted && (
                        <Check size={18} className="text-white" strokeWidth={3} />
                    )}
                </button>
            </div>

            <div className="flex-1 min-w-0">
                <div
                    className={cn(
                        "text-[15.69px] font-bold leading-[100%] tracking-[0.25%] mb-1",
                        task.isCompleted
                            ? "text-muted-foreground line-through"
                            : "text-dark"
                    )}
                >
                    {task.title}
                </div>
                {task.description && (
                    <div
                        className={cn(
                            "text-sm mb-2",
                            task.isCompleted
                                ? "text-muted-foreground line-through"
                                : "text-muted-foreground"
                        )}
                    >
                        {task.description}
                    </div>
                )}
                {task.statusText && (
                    <div className="text-xs text-muted-foreground mb-1">
                        {task.statusText}
                    </div>
                )}
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar size={14} />
                    <span>{formattedDate}</span>
                </div>
            </div>

            <div className="flex items-start gap-2 flex-shrink-0">
                <TaskActions task={task} />
            </div>
        </div>
    );
}
