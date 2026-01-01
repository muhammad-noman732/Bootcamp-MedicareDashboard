import express from "express";
import { authRepository } from "../repositories/authRepository.ts";
import { authServices } from "../services/authServices.ts";
import { authController } from "../controllers/authController.ts";

const authRouter = express.Router();

const repository = new authRepository();
const services = new authServices(repository);
const controller = new authController(services);

authRouter.post('/signup', controller.signup)
export default authRouter 