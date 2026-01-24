import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetTasksQuery } from "@/lib/store/services/task/taskApi";
import type { Task } from "@/types/task";

type TaskFilter = "all" | "completed" | "pending";

export function useTasks() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const filterParam = searchParams.get("filter") || "all";
  const search = searchParams.get("search") || undefined;

  const filter: TaskFilter = filterParam === "completed" || filterParam === "pending" ? filterParam : "all";

  const isCompleted = filter === "completed" ? true : filter === "pending" ? false : undefined;

  const { data, isLoading, isError, error } = useGetTasksQuery({
    page,
    limit,
    isCompleted: isCompleted === undefined ? undefined : isCompleted,
    search,
  });

  const setPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    params.set("limit", limit.toString());
    setSearchParams(params);
  };

  const setFilter = (newFilter: TaskFilter) => {
    const params = new URLSearchParams(searchParams);
    params.set("filter", newFilter);
    params.set("page", "1");
    setSearchParams(params);
  };

  const tasks: Task[] = useMemo(() => {
    if (!data?.data?.data) return [];
    return data.data.data;
  }, [data]);

  if (isError) {
    console.error("Failed to fetch tasks", error);
  }

  return {
    tasks,
    pagination: data?.data?.pagination || {
      currentPage: 1,
      totalPages: 1,
      totalRecords: 0,
      recordsPerPage: limit,
      hasNextPage: false,
      hasPrevPage: false,
    },
    stats: data?.data?.stats || {
      all: 0,
      completed: 0,
      pending: 0,
    },
    isLoading,
    currentPage: page,
    filter,
    search: search || "",
    setPage,
    setFilter,
  };
}

