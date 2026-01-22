import { Check, MoreHorizontal, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetTasksQuery } from "@/lib/store/services/task/taskApi";
import { Loader2 } from "lucide-react";
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

export function TasksCard() {
    const navigate = useNavigate();
    const { data, isLoading } = useGetTasksQuery({
        page: 1,
        limit: 4,
    });

    const tasks: Task[] = data?.data?.data || [];

    return (
        <Card className="w-full max-w-[709px] rounded-[4.9px] border-0 bg-white p-6">
            <CardHeader className="flex flex-row items-center justify-between h-[30px] px-0 pt-0">
                <CardTitle className="text-base font-bold leading-[100%] tracking-[0.25%] text-black">
                    Tasks
                </CardTitle>

                <Button
                    variant="ghost"
                    onClick={() => navigate("/dashboard/tasks")}
                    className="flex items-center gap-2 text-primary hover:text-primary hover:bg-transparent p-0 h-auto"
                >
                    <span className="text-[12.75px] font-semibold leading-[100%] tracking-[0.4%] text-primary">
                        New Tasks
                    </span>
                    <div className="relative flex items-center justify-center w-[24px] h-[24px] rounded border-[0.72px] border-[#E0E0E0] ">
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
                        {tasks.map((task) => (
                            <div
                                key={task.id}
                                className="flex items-start gap-4 p-4 min-h-[100px] rounded-lg bg-[#FBFBFB] border-[0.98px] border-[#FAFAFA]"
                            >
                                <div className="flex-shrink-0">
                                    {task.isCompleted ? (
                                        <div className="flex items-center justify-center w-[31.38002197504261px] h-[31.38002006769375px] rounded-[5.88px] bg-[#2F80ED]">
                                            <Check size={18} className="text-white" strokeWidth={3} />
                                        </div>
                                    ) : (
                                        <div className="w-[31.38002197504261px] h-[31.38002006769375px] rounded-[5.88px] border-[0.98px] border-[#E0E0E0] bg-white" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-[15.69px] font-bold leading-[100%] tracking-[0.25%] text-black mb-1">
                                        {task.statusText || task.title}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {task.description || task.title}
                                    </div>
                                </div>
                                <div className="flex items-end gap-4 flex-shrink-0 pb-1">
                                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                                        {formatDate(task.date)}
                                    </span>
                                    <button className="relative flex items-center justify-center w-[24px] h-[24px] rounded border-[0.72px] border-[#E0E0E0] bg-white p-0 hover:bg-muted/50 transition-colors">
                                        <MoreHorizontal size={18} className="text-[#2F80ED]" />
                                    </button>
                                </div>
                            </div>
                        ))}
                        <div className="flex justify-end pt-2">
                            <Button
                                variant="ghost"
                                onClick={() => navigate("/dashboard/tasks")}
                                className="flex items-center gap-1 text-primary hover:text-primary hover:bg-transparent p-0 h-auto"
                            >
                                <span className="text-primary font-medium">View all</span>
                                <span className="text-primary">›</span>
                            </Button>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}

