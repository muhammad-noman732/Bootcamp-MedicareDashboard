export interface ApiResponse<T> {
    status: "success" | "error" | "fail";
    message: string;
    data: T;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }
}
