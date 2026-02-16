import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../utils/appError.ts";

interface VerifyTokenPayload {
    email: string;
    userId: string;
    iat?: number;
    exp?: number;
}

export interface RequestWithVerifyUser extends Request {
    verifyUser?: VerifyTokenPayload;
}

export const verifyEmailAuth = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const token = req.cookies?.verify_token;

    if (!token) {
        throw new UnauthorizedError("Verification token missing. Please sign up again.");
    }

    try {
        const secret = process.env.JWT_VERIFY_SECRET;

        if (!secret) {
            throw new Error("JWT_VERIFY_SECRET is not configured");
        }

        const decoded = jwt.verify(token, secret) as VerifyTokenPayload;

        (req as RequestWithVerifyUser).verifyUser = {
            email: decoded.email,
            userId: decoded.userId
        };

        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new UnauthorizedError("Verification token has expired. Please sign up again.");
        } else if (error instanceof jwt.JsonWebTokenError) {
            throw new UnauthorizedError("Invalid verification token. Please sign up again.");
        }
        throw new UnauthorizedError("Verification failed. Please sign up again.");
    }
};