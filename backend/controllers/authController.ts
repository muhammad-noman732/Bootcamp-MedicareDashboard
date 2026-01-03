import type { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { authSchema, loginSchema } from "../schema/userSchema.ts";
import { verifyEmailSchema, resendOTPSchema } from "../schema/emailVerificationSchema.ts";
import { AuthService } from "../services/authServices.ts";
import type { AuthUserResponse } from "../types/authTypes.ts";
import { UnauthorizedError } from "../utils/appError.ts";

export class AuthController {
    constructor(private authService: AuthService) { }

    private sendTokenResponse(res: Response, result: { user: AuthUserResponse, accessToken: string, refreshToken: string }, message: string) {
        const { user, accessToken, refreshToken } = result;

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict' as const,
            maxAge: 7 * 24 * 60 * 60 * 1000
        };

        res.cookie('refreshToken', refreshToken, cookieOptions);

        res.status(200).json({
            status: "success",
            message,
            data: {
                user,
                accessToken
            }
        });
    }


    signup = asyncHandler(async (req: Request, res: Response) => {
        const body = authSchema.parse(req.body);
        const result = await this.authService.createUser(body);

        res.status(201).json({
            status: "success",
            message: result.message,
            data: {
                email: result.user.email,
                userName: result.user.userName,
            }
        });
    });

    login = asyncHandler(async (req: Request, res: Response) => {
        const data = loginSchema.parse(req.body);
        const result = await this.authService.loginUser(data);
        this.sendTokenResponse(res, result, "Login successful");
    });

    // refresh access token
    refresh = asyncHandler(async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            throw new UnauthorizedError("Refresh token required")
        }

        const { accessToken, refreshToken: newRefreshToken } = await this.authService.refreshAccessToken(refreshToken);

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            sameSite: 'strict' as const,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
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

    verifyEmail = asyncHandler(async (req: Request, res: Response) => {
        const { email, otp } = verifyEmailSchema.parse(req.body);

        const result = await this.authService.verifyEmail(email, otp);

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict' as const,
            maxAge: 7 * 24 * 60 * 60 * 1000
        };

        res.cookie('refreshToken', result.refreshToken, cookieOptions);

        res.status(200).json({
            status: "success",
            message: "Email verified successfully. You are now logged in.",
            data: {
                user: result.user,
                accessToken: result.accessToken
            }
        });
    });


    resendVerificationOTP = asyncHandler(async (req: Request, res: Response) => {
        const { email } = resendOTPSchema.parse(req.body);

        const result = await this.authService.resendVerificationOTP(email);

        res.status(200).json({
            status: "success",
            message: result.message
        });
    });
}
