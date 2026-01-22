import express from "express";
import { AuthRepository } from "../repositories/authRepository.ts";
import { AuthService } from "../services/authServices.ts";
import { AuthController } from "../controllers/authController.ts";
import { JwtService } from "../lib/jwt.ts";
import { SendGridService } from "../lib/sendGrid.ts";

import { verifyEmailAuth } from "../middlewares/verifyEmailMiddleware.ts";

import { AuthMiddleware } from "../middlewares/authMiddleware.ts";

const authRouter = express.Router();

const repository = new AuthRepository();
const jwtService = new JwtService();
const sendGridService = new SendGridService();
const services = new AuthService(repository, jwtService, sendGridService);
const controller = new AuthController(services);
const authMiddleware = new AuthMiddleware(jwtService);

// Authentication routes
authRouter.post('/signup', controller.signup);
authRouter.post('/login', controller.login);
authRouter.post('/refresh', controller.refresh);
authRouter.post('/logout', controller.logout);

// Email verification routes
authRouter.post('/verify-email', verifyEmailAuth, controller.verifyEmail);
authRouter.post('/resend-verification', verifyEmailAuth, controller.resendVerificationOTP);
authRouter.post('/google', controller.googleLogin);

// Protected routes
authRouter.get('/me', authMiddleware.authMiddleware, controller.getMe);
authRouter.patch('/change-password', authMiddleware.authMiddleware, controller.changePassword);
authRouter.patch('/update-profile', authMiddleware.authMiddleware, controller.updateProfile);
authRouter.post('/onboarding', authMiddleware.authMiddleware, controller.completeOnboarding);


export default authRouter; 