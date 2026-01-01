import type { ValidationErrorDetail } from "../types/error.types";

export class AppError extends Error {
    public status: string; // Will be "fail" or "error"

    // here in constructur with public we are directly assigning the value as well
    constructor(
        public statusCode: number,
        message: string,
        public isOperational: boolean = true
    ) {
        super(message);
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        Error.captureStackTrace(this, this.constructor);
    }
}


export class NotFoundError extends AppError {
    constructor(public resource: string) {
        super(404, `${resource} not found`, true);
    }
}


export class ValidationError extends AppError {
    constructor(
        message: string = 'Validation failed',
        public errors: ValidationErrorDetail[] = []) {
        super(400, message, true)
    }
}


export class BadRequestError extends AppError {
    constructor(message: string = 'Bad request') {
        super(400, message, true);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string = 'Authentication required') {
        super(401, message, true);
    }
}


export class ForbiddenError extends AppError {
    constructor(message: string = 'Access forbidden') {
        super(403, message, true);
    }
}


export class ConflictError extends AppError {
    constructor(message: string = 'Resource conflict') {
        super(409, message, true);
    }
}


export class TooManyRequestsError extends AppError {
    constructor(
        message: string = 'Too many requests',
        public retryAfter?: number // Seconds to wait
    ) {
        super(429, message, true);
    }
}


export class InternalServerError extends AppError {
    constructor(
        message: string = 'Internal server error',
        public originalError?: Error // Store original error for logging
    ) {
        super(500, message, false); // isOperational = false (don't show details)
    }
}



export class ServiceUnavailableError extends AppError {
    constructor(
        message: string = 'Service temporarily unavailable',
        public retryAfter?: number
    ) {
        super(503, message, false);
    }
}



export const isOperationalError = (error: Error): boolean => {
    if (error instanceof AppError) {
        return error.isOperational;
    }
    return false;
};
