import express from "express";
import { AuthRepository } from "../repositories/authRepository.ts";
import { AuthService } from "../services/authServices.ts";
import { AuthController } from "../controllers/authController.ts";
import { JwtService } from "../lib/jwt.ts";
import { SendGridService } from "../lib/sendGrid.ts";

const authRouter = express.Router();

const repository = new AuthRepository();
const jwtService = new JwtService();
const sendGridService = new SendGridService();
const services = new AuthService(repository, jwtService, sendGridService);
const controller = new AuthController(services);

// Authentication routes
authRouter.post('/signup', controller.signup);
authRouter.post('/login', controller.login);
authRouter.post('/refresh', controller.refresh);
authRouter.post('/logout', controller.logout);

// Email verification routes
authRouter.post('/verify-email', controller.verifyEmail);
authRouter.post('/resend-verification', controller.resendVerificationOTP);
authRouter.post('/google', controller.googleLogin);

export default authRouter; 