import type { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { authSchema, loginSchema } from "../schema/userSchema.ts";
import { AuthService } from "../services/authServices.ts";
import type { User } from "../generated/prisma/client";

export class AuthController {
    constructor(private authService: AuthService) { }

    private sendTokenResponse(res: Response, result: { user: Partial<User> | null, accessToken: string, refreshToken: string }, message: string) {
        const { user, accessToken, refreshToken } = result;

        // HTTP-Only Cookie for Refresh Token (Security Best Practice)
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Send only over HTTPS in prod
            sameSite: 'strict' as const,
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        };

        res.cookie('refreshToken', refreshToken, cookieOptions);

        res.status(200).json({
            status: "success",
            message,
            data: {
                user, // Type is strictly Partial<User> now
                accessToken // Refresh token is intentionally NOT in the body, only cookie
            }
        });
    }

    signup = asyncHandler(async (req: Request, res: Response) => {
        const body = authSchema.parse(req.body);
        const result = await this.authService.createUser(body);
        this.sendTokenResponse(res, result, "User created successfully");
    });

    login = asyncHandler(async (req: Request, res: Response) => {
        const data = loginSchema.parse(req.body);
        const result = await this.authService.loginUser(data);
        this.sendTokenResponse(res, result, "Login successful");
    });

    refresh = asyncHandler(async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            res.status(401).json({ status: "fail", message: "Refresh token required" });
            return;
        }

        const { accessToken } = await this.authService.refreshAccessToken(refreshToken);

        res.status(200).json({
            status: "success",
            data: { accessToken }
        });
    });

    logout = asyncHandler(async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken;

        if (refreshToken) {
            await this.authService.logoutUser(refreshToken);
        }

        res.clearCookie('refreshToken');

        res.status(200).json({
            status: "success",
            message: "Logged out successfully"
        });
    });
}
