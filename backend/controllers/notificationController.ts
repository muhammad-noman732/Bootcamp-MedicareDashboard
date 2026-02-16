import { Request, Response } from "express";
import { NotificationService } from "../services/notificationService.ts";
import { notificationManager } from "../lib/notificationManager.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";

export class NotificationController {
    constructor(private service: NotificationService) { }

    getNotifications = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user.id;
        const notifications = await this.service.getUserNotifications(userId);
        res.status(200).json(notifications);
    });


    markAsRead = asyncHandler(async (req: Request, res: Response) => {
        const id = req.params.id as string;
        await this.service.markAsRead(id);
        res.status(200).json({ message: "Notification marked as read" });
    });

    markAllRead = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user.id;
        await this.service.markAllAsRead(userId);
        res.status(200).json({ message: "All notifications marked as read" });
    });

    subscribe = (req: Request, res: Response) => {
        const userId = req.user.id;

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        notificationManager.addClient(userId, res);
    };
}