import { Skeleton } from "@/components/ui/skeleton";
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
            <div className="flex flex-col gap-3">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div
                        key={i}
                        className="flex items-start gap-4 p-4 min-h-[96px] rounded-lg bg-white border border-border shadow-sm"
                    >
                        <Skeleton className="flex-shrink-0 mt-1 w-[32px] h-[32px] rounded-[6px]" />
                        <div className="flex-1 min-w-0 space-y-3 mt-1">
                            <Skeleton className="h-4 w-3/4 rounded-sm" />
                            <Skeleton className="h-3 w-1/2 rounded-sm" />
                        </div>
                        <div className="flex items-center gap-4 flex-shrink-0 self-center">
                            <Skeleton className="h-4 w-16 rounded-sm" />
                            <Skeleton className="w-8 h-8 rounded-md" />
                        </div>
                    </div>
                ))}
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