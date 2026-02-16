import { PrismaClient } from "@prisma/client";
import { prisma } from "../lib/prisma.ts";

export class NotificationRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = prisma;
    }

    async create(data: { userId: string; title: string; message: string; type: string; link?: string }) {
        return await this.prisma.notification.create({
            data
        });
    }

    async getByUserId(userId: string) {
        return await this.prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 50
        });
    }

    async markAsRead(id: string) {
        return await this.prisma.notification.update({
            where: { id },
            data: { isRead: true }
        });
    }

    async markAllAsRead(userId: string) {
        return await this.prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true }
        });
    }

    async delete(id: string) {
        return await this.prisma.notification.delete({
            where: { id }
        });
    }
}