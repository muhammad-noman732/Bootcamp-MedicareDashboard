export interface ApiResponse<T> {
    status: "success" | "error" | "fail";
    message: string;
    data: T;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalRecords: number;
        recordsPerPage: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    }
}
