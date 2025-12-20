import type { Request , Response, NextFunction } from "express";
import { NotFoundError } from "./appError";

export const notFoundHandler = (
    req: Request,
    res:Response,
    next:NextFunction
)=>{
    const error = new NotFoundError(`Route ${req.originalUrl}`)

    next(error)
}