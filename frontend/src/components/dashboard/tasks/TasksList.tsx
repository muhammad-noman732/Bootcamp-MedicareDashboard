import { Loader2 } from "lucide-react";
import { TaskItem } from "./TaskItem";
import type { Task } from "@/types/task";

type TasksListProps = {
    tasks: Task[];
    isLoading?: boolean;
    onToggle: (id: string, isCompleted: boolean) => void;
    onEdit: (task: Task) => void;
    onDelete: (id: string, title: string) => void;
};

export function TasksList({
    tasks,
    isLoading,
    onToggle,
    onEdit,
    onDelete,
}: TasksListProps) {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (tasks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-lg font-medium text-[#1D1D1D] mb-2">No tasks found</p>
                <p className="text-sm text-muted-foreground">
                    Create your first task to get started
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            {tasks.map((task) => (
                <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={onToggle}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}