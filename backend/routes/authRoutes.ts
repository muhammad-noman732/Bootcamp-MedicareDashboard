import express from "express";
import { AuthRepository } from "../repositories/authRepository";
import { AuthService } from "../services/authServices";
import { AuthController } from "../controllers/authController";
import { JwtService } from "../lib/jwt";
import { SendGridService } from "../lib/sendGrid";

import { verifyEmailAuth } from "../middlewares/verifyEmailMiddleware";

import { AuthMiddleware } from "../middlewares/authMiddleware";
import { upload } from "../middlewares/uploadMiddleware";
import { validate } from "../middlewares/validateMiddleware";
import {
    authSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    changePasswordSchema,
    updateProfileSchema,
    onboardingSchema
} from "../validations/userSchemaValidation";
import { verifyEmailSchema } from "../validations/emailVerificationValidition";


const authRouter = express.Router();

const repository = new AuthRepository();
const jwtService = new JwtService();
const sendGridService = new SendGridService();
const services = new AuthService(repository, jwtService, sendGridService);
const controller = new AuthController(services);
const authMiddleware = new AuthMiddleware(jwtService);


authRouter.post('/signup', validate(authSchema), controller.signup);
authRouter.post('/login', validate(loginSchema), controller.login);
authRouter.post('/refresh', controller.refresh);
authRouter.post('/logout', controller.logout);

authRouter.post('/forgot-password', validate(forgotPasswordSchema), controller.forgotPassword);
authRouter.post('/reset-password', validate(resetPasswordSchema), controller.resetPassword);

authRouter.post('/verify-email', verifyEmailAuth, validate(verifyEmailSchema), controller.verifyEmail);
authRouter.post('/resend-verification', verifyEmailAuth, controller.resendVerificationOTP);
authRouter.post('/google', controller.googleLogin);


authRouter.get('/me', authMiddleware.authMiddleware, controller.getMe);
authRouter.patch('/change-password', authMiddleware.authMiddleware, validate(changePasswordSchema), controller.changePassword);
authRouter.patch('/update-profile', authMiddleware.authMiddleware, upload.single('avatar'), validate(updateProfileSchema), controller.updateProfile);
authRouter.post('/onboarding', authMiddleware.authMiddleware, validate(onboardingSchema), controller.completeOnboarding);


export default authRouter;
