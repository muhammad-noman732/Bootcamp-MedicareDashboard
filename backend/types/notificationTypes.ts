import { Notification } from "@prisma/client";

export type NotificationResponse = Notification;

export interface CreateNotificationDTO {
    userId: string;
    title: string;
    message: string;
    type: string;
    link?: string;
}
