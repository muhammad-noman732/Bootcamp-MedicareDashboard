import { NotificationRepository } from "../repositories/notificationRepository.ts";
import { notificationManager } from "../lib/notificationManager.ts";

export class NotificationService {
    constructor(private repository: NotificationRepository) { }

    async createNotification(userId: string, title: string, message: string, type: string, link?: string) {
        const notification = await this.repository.create({ userId, title, message, type, link });

        notificationManager.sendNotification(userId, notification);

        return notification;
    }

    async getUserNotifications(userId: string) {
        return await this.repository.getByUserId(userId);
    }

    async markAsRead(id: string) {
        return await this.repository.markAsRead(id);
    }

    async markAllAsRead(userId: string) {
        return await this.repository.markAllAsRead(userId);
    }

    async deleteNotification(id: string) {
        return await this.repository.delete(id);
    }
}