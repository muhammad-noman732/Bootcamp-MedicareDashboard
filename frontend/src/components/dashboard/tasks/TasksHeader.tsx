import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TaskFilter = "all" | "completed" | "pending";

type TasksHeaderProps = {
    stats: {
        all: number;
        completed: number;
        pending: number;
    };
    onAddTask: () => void;
    filter: TaskFilter;
    onFilterChange: (filter: TaskFilter) => void;
    isLoading?: boolean;
};

export function TasksHeader({
    stats,
    onAddTask,
    filter,
    onFilterChange,
    isLoading,
}: TasksHeaderProps) {
    return (
        <div className="flex flex-col gap-4 bg-white p-6 border-[0.98px] border-[#E0E0E0] rounded-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-medium text-black">
                        Tasks <span className="text-muted-foreground font-normal">({isLoading ? <Skeleton className="inline-block h-6 w-8 align-middle" /> : stats.all})</span>
                    </h1>
                </div>
                <Button
                    onClick={onAddTask}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2"
                >
                    <Plus size={20} />
                    <span>Add Task</span>
                </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex gap-2">
                    <Button
                        variant={filter === "all" ? "default" : "outline"}
                        onClick={() => onFilterChange("all")}
                        className={cn(
                            filter === "all" && "bg-primary hover:bg-primary/90"
                        )}
                    >
                        All ({isLoading ? <Skeleton className="inline-block h-4 w-4 rounded-full" /> : stats.all})
                    </Button>
                    <Button
                        variant={filter === "completed" ? "default" : "outline"}
                        onClick={() => onFilterChange("completed")}
                        className={cn(
                            filter === "completed" && "bg-primary hover:bg-primary/90"
                        )}
                    >
                        Completed ({isLoading ? <Skeleton className="inline-block h-4 w-4 rounded-full" /> : stats.completed})
                    </Button>
                    <Button
                        variant={filter === "pending" ? "default" : "outline"}
                        onClick={() => onFilterChange("pending")}
                        className={cn(
                            filter === "pending" && "bg-primary hover:bg-primary/90"
                        )}
                    >
                        Pending ({isLoading ? <Skeleton className="inline-block h-4 w-4 rounded-full" /> : stats.pending})
                    </Button>
                </div>
            </div>
        </div>
    );
}