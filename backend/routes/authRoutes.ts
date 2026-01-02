import express from "express";
import { AuthRepository } from "../repositories/authRepository.ts";
import { AuthService } from "../services/authServices.ts";
import { AuthController } from "../controllers/authController.ts";
import { JwtService } from "../lib/jwt.ts";

const authRouter = express.Router();

const repository = new AuthRepository();
const jwtService = new JwtService();
const services = new AuthService(repository, jwtService);
const controller = new AuthController(services);

authRouter.post('/signup', controller.signup)
authRouter.post('/login', controller.login)
authRouter.post('/refresh', controller.refresh)
authRouter.post('/logout', controller.logout)

export default authRouter 