import express from "express";
import { NotificationRepository } from "../repositories/notificationRepository";
import { NotificationService } from "../services/notificationService";
import { NotificationController } from "../controllers/notificationController";
import { AuthMiddleware } from "../middlewares/authMiddleware";
import { JwtService } from "../lib/jwt";

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
