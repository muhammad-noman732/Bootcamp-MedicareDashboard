import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useGetTasksQuery } from "@/lib/store/services/task/taskApi";
import { useToggleTask } from "@/hooks/useToggleTask";
import type { Task } from "@/types/task";

export function useTasksCard() {
    const navigate = useNavigate();
    const { data, isLoading } = useGetTasksQuery({
        page: 1,
        limit: 4,
    });

    const { handleToggle, isLoading: isToggling } = useToggleTask();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const tasks: Task[] = useMemo(() => data?.data?.data || [], [data]);

    const openCreateModal = useCallback(() => setIsCreateModalOpen(true), []);
    const closeCreateModal = useCallback(() => setIsCreateModalOpen(false), []);

    const openUpdateModal = useCallback((task: Task) => {
        setSelectedTask(task);
        setIsUpdateModalOpen(true);
    }, []);

    const closeUpdateModal = useCallback(() => {
        setIsUpdateModalOpen(false);
        setSelectedTask(null);
    }, []);

    const openDeleteModal = useCallback((task: Task) => {
        setSelectedTask(task);
        setIsDeleteModalOpen(true);
    }, []);

    const closeDeleteModal = useCallback(() => {
        setIsDeleteModalOpen(false);
        setSelectedTask(null);
    }, []);

    const onToggleTask = useCallback((id: string, isCompleted: boolean, title: string) => {
        if (!isToggling) {
            handleToggle(id, isCompleted, title);
        }
    }, [handleToggle, isToggling]);

    const viewAllTasks = useCallback(() => navigate("/dashboard/tasks"), [navigate]);

    return {
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
    };
}
