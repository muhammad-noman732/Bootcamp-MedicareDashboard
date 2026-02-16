import express from "express";
import { AnalyticsRepository } from "../repositories/analyticsRepository.ts";
import { AnalyticsService } from "../services/analyticsService.ts";
import { AnalyticsController } from "../controllers/analyticsController.ts";
import { AuthMiddleware } from "../middlewares/authMiddleware.ts";
import { JwtService } from "../lib/jwt.ts";

const analyticsRouter = express.Router();

const repository = new AnalyticsRepository();
const service = new AnalyticsService(repository);
const controller = new AnalyticsController(service);

const jwtService = new JwtService();
const authMiddleware = new AuthMiddleware(jwtService);

analyticsRouter.get(
    "/dashboard",
    authMiddleware.authMiddleware,
    controller.getDashboardAnalytics
);

export default analyticsRouter;