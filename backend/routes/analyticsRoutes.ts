import express from "express";
import { AnalyticsRepository } from "../repositories/analyticsRepository";
import { AnalyticsService } from "../services/analyticsService";
import { AnalyticsController } from "../controllers/analyticsController";
import { AuthMiddleware } from "../middlewares/authMiddleware";
import { JwtService } from "../lib/jwt";

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
