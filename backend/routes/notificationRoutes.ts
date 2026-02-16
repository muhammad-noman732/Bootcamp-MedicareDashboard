import express from "express";
import { NotificationRepository } from "../repositories/notificationRepository.ts";
import { NotificationService } from "../services/notificationService.ts";
import { NotificationController } from "../controllers/notificationController.ts";
import { AuthMiddleware } from "../middlewares/authMiddleware.ts";
import { JwtService } from "../lib/jwt.ts";

const notificationRouter = express.Router();

const repository = new NotificationRepository();
const service = new NotificationService(repository);
const controller = new NotificationController(service);

const jwtService = new JwtService();
const authMiddleware = new AuthMiddleware(jwtService);

notificationRouter.get("/", authMiddleware.authMiddleware, controller.getNotifications);
notificationRouter.patch("/read-all", authMiddleware.authMiddleware, controller.markAllRead);
notificationRouter.patch("/:id/read", authMiddleware.authMiddleware, controller.markAsRead);

notificationRouter.get("/stream", authMiddleware.authMiddleware, controller.subscribe);

export default notificationRouter;
export { service as notificationServiceInstance };  