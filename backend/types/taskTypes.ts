import { Task } from "../generated/prisma/client";

export type TaskWithUser = Task & {
    user: {
        id: string;
        email: string;
        userName: string;
    };
};

export type CreateTaskData = Pick<
    Task,
    'userId' | 'title' | 'description' | 'date' | 'status' | 'statusText'
>;

export type UpdateTaskData = Partial<Pick<
    Task,
    'title' | 'description' | 'date' | 'status' | 'statusText' | 'isCompleted'
>>;

export interface TaskPagination {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    recordsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface TaskStats {
    all: number;
    completed: number;
    pending: number;
}

export interface TaskQueryResponse {
    data: Task[];
    pagination: TaskPagination;
    stats: TaskStats;
}
