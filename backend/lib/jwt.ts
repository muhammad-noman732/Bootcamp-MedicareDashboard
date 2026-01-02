import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { NotFoundError, UnauthorizedError } from "../utils/appError";

interface TokenPayload extends JwtPayload {
    userId: string;
    type: "access" | "refresh";
}

export class JwtService {
    private readonly accessSecret: string;
    private readonly refreshSecret: string;
    private readonly accessExpiresIn: string;
    private readonly refreshExpiresIn: string;
    private readonly algorithm: jwt.Algorithm = "HS256";

    constructor() {
        if (!process.env.JWT_ACCESS_SECRET) {
            throw new NotFoundError("JWT_ACCESS_SECRET");
        }

        if (!process.env.JWT_REFRESH_SECRET) {
            throw new NotFoundError("JWT_REFRESH_SECRET is required");
        }

        this.accessSecret = process.env.JWT_ACCESS_SECRET;
        this.refreshSecret = process.env.JWT_REFRESH_SECRET;
        this.accessExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN ?? "15m";
        this.refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN ?? "7d";
    }

    generateAccessToken(userId: string): string {
        return this.signToken(
            { userId, type: "access" },
            this.accessSecret,
            { expiresIn: this.accessExpiresIn as SignOptions['expiresIn'] }
        );
    }

    generateRefreshToken(userId: string): string {
        return this.signToken(
            { userId, type: "refresh" },
            this.refreshSecret,
            { expiresIn: this.refreshExpiresIn as SignOptions['expiresIn'] }
        );
    }

    verifyAccessToken(token: string): TokenPayload {
        const payload = this.verifyToken(token, this.accessSecret);
        if (payload.type !== "access") {
            throw new UnauthorizedError("Invalid access token");
        }
        return payload;
    }

    verifyRefreshToken(token: string): TokenPayload {
        const payload = this.verifyToken(token, this.refreshSecret);
        if (payload.type !== "refresh") {
            throw new UnauthorizedError("Invalid refresh token");
        }
        return payload;
    }

    private signToken(
        payload: Omit<TokenPayload, "iat" | "exp">,
        secret: string,
        options: SignOptions
    ): string {
        return jwt.sign(payload, secret, {
            ...options,
            algorithm: this.algorithm,
        });
    }

    private verifyToken(token: string, secret: string): TokenPayload {
        try {
            return jwt.verify(token, secret, {
                algorithms: [this.algorithm],
            }) as TokenPayload;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new UnauthorizedError("Token expired");
            }
            if (error instanceof jwt.JsonWebTokenError) {
                throw new UnauthorizedError("Invalid token");
            }
            throw new UnauthorizedError("Token verification failed");
        }
    }
}
