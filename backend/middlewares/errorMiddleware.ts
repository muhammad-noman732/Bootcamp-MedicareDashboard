import type { Request, Response, NextFunction } from "express";
import { AppError, ValidationError } from "../utils/appError";

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            message: err.message,
            status: err.status,
            ...(err instanceof ValidationError && { error: err.errors })
        });
        return;
    }


    res.status(500).json({
        status: 'error',
        message: process.env.NODE_ENV === 'development'
            ? err.message
            : 'Something went wrong'
    });
}

