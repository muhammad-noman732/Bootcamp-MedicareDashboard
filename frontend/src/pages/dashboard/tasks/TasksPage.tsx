import { useState } from "react";
import { TasksHeader } from "@/components/dashboard/tasks/TasksHeader";
import { TasksList } from "@/components/dashboard/tasks/TasksList";
import { TasksPagination } from "@/components/dashboard/tasks/TasksPagination";
import { CreateTaskModal } from "@/components/dashboard/tasks/modals/CreateTaskModal";
import { useTasks } from "@/hooks/useTasks";
import { useToggleTask } from "@/hooks/useToggleTask";
import { useDeleteTask } from "@/hooks/useDeleteTask";
import type { Task } from "@/types/task";

export const TasksPage = () => {
    const {
        tasks,
        pagination,
        stats,
        isLoading,
        filter,
        setPage,
        setFilter,
    } = useTasks();

    const { handleToggle } = useToggleTask();
    const { handleDelete } = useDeleteTask();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const handleToggleTask = (id: string, isCompleted: boolean) => {
        const task = tasks.find((t) => t.id === id);
        if (task) {
            handleToggle(id, isCompleted, task.title);
        }
    };

    const handleDeleteTask = (id: string, title: string) => {
        handleDelete(id, title);
    };

    return (
        <div className="w-full max-w-[1169px] mx-auto max-h-[83vh] flex flex-col px-[26px] pt-[15px]">
            <div className="text-sm text-[#1D1D1D] mb-4">Tasks &gt; All Tasks</div>

            <div className="mb-4">
                <TasksHeader
                    stats={stats}
                    onAddTask={() => setIsCreateModalOpen(true)}
                    filter={filter}
                    onFilterChange={setFilter}
                />
            </div>

            <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto">
                    <TasksList
                        tasks={tasks}
                        isLoading={isLoading}
                        onToggle={handleToggleTask}
                        onEdit={() => { }}
                        onDelete={handleDeleteTask}
                    />
                </div>
            </div>

            {pagination.totalPages > 1 && (
                <div className="mt-4 shrink-0">
                    <TasksPagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={setPage}
                    />
                </div>
            )}

            <CreateTaskModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </div>
    );
};

export default TasksPage;
