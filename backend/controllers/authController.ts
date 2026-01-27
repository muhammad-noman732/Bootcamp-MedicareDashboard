import type { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { authSchema, loginSchema, changePasswordSchema, updateProfileSchema, onboardingSchema, forgotPasswordSchema, resetPasswordSchema } from "../schema/userSchema.ts";
import { verifyEmailSchema, resendOTPSchema } from "../schema/emailVerificationSchema.ts";
import { AuthService } from "../services/authServices.ts";
import type { AuthUserResponse } from "../types/authTypes.ts";
import { UnauthorizedError } from "../utils/appError.ts";
import { OAuth2Client } from 'google-auth-library'
import type { RequestWithVerifyUser } from "../middlewares/verifyEmailMiddleware.ts";
import { uploadToCloudinary } from "../utils/cloudinary.ts";




export class AuthController {
    private googleClient: OAuth2Client;

    constructor(private authService: AuthService) {
        this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    }

    private sendTokenResponse(res: Response, result: { user: AuthUserResponse, accessToken: string, refreshToken: string }, message: string) {
        const { user, accessToken, refreshToken } = result;

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: (process.env.NODE_ENV === 'production' ? 'none' : 'strict') as 'none' | 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        };

        res.cookie('refreshToken', refreshToken, cookieOptions);
        res.cookie('accessToken', accessToken, cookieOptions);

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

        res.cookie('verify_token', result.verifyToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: (process.env.NODE_ENV === 'production' ? 'none' : 'strict') as 'none' | 'strict',
            maxAge: 10 * 60 * 1000
        });

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
            sameSite: (process.env.NODE_ENV === 'production' ? 'none' : 'strict') as 'none' | 'strict',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            sameSite: (process.env.NODE_ENV === 'production' ? 'none' : 'strict') as 'none' | 'strict',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 15 * 60 * 1000 // 15 minutes
        });
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

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: (process.env.NODE_ENV === 'production' ? 'none' : 'strict') as 'none' | 'strict',
        };

        res.clearCookie('refreshToken', cookieOptions);
        res.clearCookie('accessToken', cookieOptions);

        res.status(200).json({
            status: "success",
            message: "Logged out successfully"
        });
    });


    verifyEmail = asyncHandler(async (req: Request, res: Response) => {
        const { otp } = verifyEmailSchema.parse(req.body);
        const { verifyUser } = req as RequestWithVerifyUser;

        if (!verifyUser) {
            throw new UnauthorizedError("Verification session expired");
        }

        const result = await this.authService.verifyEmail(verifyUser.userId, otp);

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: (process.env.NODE_ENV === 'production' ? 'none' : 'strict') as 'none' | 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        };

        res.cookie('refreshToken', result.refreshToken, cookieOptions);
        res.cookie('accessToken', result.accessToken, cookieOptions);
        res.clearCookie('verify_token');

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
        const { verifyUser } = req as RequestWithVerifyUser;

        if (!verifyUser) {
            throw new UnauthorizedError("Verification session expired");
        }

        const result = await this.authService.resendVerificationOTP(verifyUser.userId);

        res.cookie('verify_token', result.verifyToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: (process.env.NODE_ENV === 'production' ? 'none' : 'strict') as 'none' | 'strict',
            maxAge: 10 * 60 * 1000 // 10 minutes
        });

        res.status(200).json({
            status: "success",
            message: result.message
        });
    });


    googleLogin = asyncHandler(async (req: Request, res: Response) => {

        const ticket = await this.googleClient.verifyIdToken({
            idToken: req.body.idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if (!payload) {
            throw new UnauthorizedError("Invalid Google token");
        }

        const { email, name, picture, sub, email_verified, iss } = payload;

        // 1. Payload Safety Checks
        if (!email || !sub) {
            throw new UnauthorizedError("Invalid Google account data: email or sub missing");
        }


        if (!email_verified) {
            throw new UnauthorizedError("Google email not verified");
        }

        if (iss !== 'accounts.google.com' && iss !== 'https://accounts.google.com') {
            throw new UnauthorizedError("Invalid token issuer");
        }

        const normalizedEmail = email.toLowerCase();
        const userName = name || normalizedEmail.split('@')[0];
        const user = await this.authService.googleLogin(normalizedEmail, userName, picture || "", sub);

        this.sendTokenResponse(res, user, "Google login successful");
    });

    getMe = asyncHandler(async (req: Request, res: Response) => {
        const { id: userId } = req.user;
        const user = await this.authService.getCurrentUser(userId);

        res.status(200).json({
            status: "success",
            data: user
        });
    });

    changePassword = asyncHandler(async (req: Request, res: Response) => {
        const { id: userId } = req.user;
        const data = changePasswordSchema.parse(req.body);

        await this.authService.changePassword(userId, data);

        res.status(200).json({
            status: "success",
            message: "Password changed successfully"
        });
    });

    updateProfile = asyncHandler(async (req: Request, res: Response) => {
        const { id: userId } = req.user;

        let avatarUrl: string | undefined;
        if (req.file) {
            avatarUrl = await uploadToCloudinary(req.file.buffer);
        }

        const bodyData = req.body || {};
        const data = updateProfileSchema.parse(bodyData);

        const updateData = {
            ...data,
            ...(avatarUrl && { avatar: avatarUrl })
        };

        const updatedUser = await this.authService.updateProfile(userId, updateData);

        res.status(200).json({
            status: "success",
            message: "Profile updated successfully",
            data: updatedUser
        });
    });

    completeOnboarding = asyncHandler(async (req: Request, res: Response) => {
        const { id: userId } = req.user;
        const data = onboardingSchema.parse(req.body);

        const updatedUser = await this.authService.completeOnboarding(userId, data);

        res.status(200).json({
            status: "success",
            message: "Onboarding completed successfully",
            data: updatedUser
        });
    });

    forgotPassword = asyncHandler(async (req: Request, res: Response) => {
        const { email } = forgotPasswordSchema.parse(req.body);
        await this.authService.forgotPassword(email);
        res.status(200).json({
            status: "success",
            message: "Password reset email sent. Please check your inbox for instructions."
        });
    });

    resetPassword = asyncHandler(async (req: Request, res: Response) => {
        const data = resetPasswordSchema.parse(req.body);
        await this.authService.resetPassword(data);
        res.status(200).json({
            status: "success",
            message: "Password reset successfully. Please login with your new password."
        });
    });
}


