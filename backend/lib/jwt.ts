import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../utils/appError";

export class JwtService {
    private readonly JWT_ACCESS_SECRET: string;
    private readonly JWT_REFRESH_SECRET: string;
    private readonly JWT_ACCESS_EXPIRES_IN: string;
    private readonly JWT_REFRESH_EXPIRES_IN: string;

    constructor() {
        this.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
        this.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || process.env.JWT_ACCESS_SECRET;
        this.JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
        this.JWT_REFRESH_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

        if (!process.env.JWT_ACCESS_SECRET) {
            console.warn('Warning: JWT_ACCESS_SECRET not defined in environment variables');
        }
    }

    generateAccessToken(userId: string): string {
        return jwt.sign(
            {
                userId,
                type: 'access'
            },
            this.JWT_ACCESS_SECRET,
            { expiresIn: this.JWT_ACCESS_EXPIRES_IN }
        );
    }

    generateRefreshToken(userId: string): string {
        return jwt.sign(
            { userId, type: 'refresh' },
            this.JWT_REFRESH_SECRET,
            { expiresIn: this.JWT_REFRESH_EXPIRES_IN }
        );
    }

    verifyAccessToken(token: string) {
        return this.verifyToken(token, this.JWT_ACCESS_SECRET);
    }

    verifyRefreshToken(token: string) {
        return this.verifyToken(token, this.JWT_REFRESH_SECRET);
    }

    private verifyToken(token: string, secret: string): { userId: string; type: string; iat: number; exp: number } {
        try {
            return jwt.verify(token, secret) as { userId: string; type: string; iat: number; exp: number };
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new UnauthorizedError('Token has expired');
            }
            if (error instanceof jwt.JsonWebTokenError) {
                throw new UnauthorizedError('Invalid token');
            }
            throw new UnauthorizedError('Token verification failed');
        }
    }
}
