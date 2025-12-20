import type {Request , Response , NextFunction } from "express";
import { AppError, ValidationError } from "../utils/appError";

export const erroHandler = (
    req: Request,
    res:Response,
    next:NextFunction,
    err:Error
): void =>{
    console.error("error caught" ,err);
    
    // If it's our custom AppError
    if(err instanceof AppError){
        res.status(err.statusCode).json({
            message: err.message,
            status:err.status,
            ...(err instanceof ValidationError && {error: err.errors})
        })
    }

        // If it's an unknown error (programming error)
    console.error('🔥 Unexpected error:', err);
      res.status(500).json({
        status: 'error',
        message: process.env.NODE_ENV === 'development' 
            ? err.message 
            : 'Something went wrong'
    });
}

