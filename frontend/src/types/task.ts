export interface Task {
    id: string;
    userId: string;
    title: string;
    description: string | null;
    date: string | null;
    status: boolean | null;
    statusText: string | null;
    isCompleted: boolean;
    createdAt: string;
    updatedAt: string;
}

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

export interface GetTasksData {
    data: Task[];
    pagination: TaskPagination;
    stats: TaskStats;
}

export interface GetTasksResponse {
    message: string;
    data: GetTasksData;
}

export interface GetTaskResponse {
    message: string;
    data: Task;
}

export interface CreateTaskInput {
    title: string;
    description?: string;
    date?: string;
    status?: boolean;
    statusText?: string;
}

export interface CreateTaskResponse {
    message: string;
    data: Task;
}

export interface UpdateTaskInput {
    id: string;
    data: {
        title?: string;
        description?: string;
        date?: string;
        status?: boolean;
        statusText?: string;
        isCompleted?: boolean;
    }
}

export interface UpdateTaskResponse {
    message: string;
    data: Task;
}

export interface ToggleTaskCompletionInput {
    id: string;
    isCompleted: boolean;
}

export interface ToggleTaskCompletionResponse {
    message: string;
    data: Task;
}

export interface DeleteTaskResponse {
    message: string;
}

export interface TaskQueryParams {
    page?: number;
    limit?: number;
    isCompleted?: boolean;
    search?: string;
}
