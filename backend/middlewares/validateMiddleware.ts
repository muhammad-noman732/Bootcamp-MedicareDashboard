import { Request, Response, NextFunction } from "express";
import { ZodError, ZodSchema } from "zod";
import { ValidationError } from "../utils/appError.ts";

export const validate = (schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = source === 'body' ? req.body : source === 'query' ? req.query : req.params;
            await schema.parseAsync(data);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errors = error.issues.map((err) => ({
                    field: err.path.join("."),
                    message: err.message,
                }));
                return next(new ValidationError("Validation failed", errors));
            }
            next(error);
        }
    };
};
