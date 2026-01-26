import { useState, useCallback } from "react";
import { useTasks } from "./useTasks";
import { useToggleTask } from "./useToggleTask";
import { useDeleteTask } from "./useDeleteTask";

export function useTasksPage() {
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

    const handleToggleTask = useCallback((id: string, isCompleted: boolean) => {
        const task = tasks.find((t) => t.id === id);
        if (task) {
            handleToggle(id, isCompleted, task.title);
        }
    }, [tasks, handleToggle]);

    const handleDeleteTask = useCallback((id: string, title: string) => {
        handleDelete(id, title);
    }, [handleDelete]);

    const openCreateModal = () => setIsCreateModalOpen(true);
    const closeCreateModal = () => setIsCreateModalOpen(false);

    return {
        tasks,
        pagination,
        stats,
        isLoading,
        filter,
        setPage,
        setFilter,
        handleToggleTask,
        handleDeleteTask,
        isCreateModalOpen,
        openCreateModal,
        closeCreateModal,
    };
}
