import { Response } from "express";
import { NotificationResponse } from "../types/notificationTypes.ts";

class NotificationManager {
    private static instance: NotificationManager;
    private clients: Map<string, Response[]> = new Map();

    private constructor() { }

    public static getInstance(): NotificationManager {
        if (!NotificationManager.instance) {
            NotificationManager.instance = new NotificationManager();
        }
        return NotificationManager.instance;
    }

    public addClient(userId: string, res: Response) {
        if (!this.clients.has(userId)) {
            this.clients.set(userId, []);
        }
        this.clients.get(userId)?.push(res);


        res.on("close", () => {
            this.removeClient(userId, res);
        });
    }

    public removeClient(userId: string, res: Response) {
        const userClients = this.clients.get(userId);
        if (userClients) {
            const index = userClients.indexOf(res);
            if (index !== -1) {
                userClients.splice(index, 1);
            }
            if (userClients.length === 0) {
                this.clients.delete(userId);
            }
        }
    }

    public sendNotification(userId: string, data: NotificationResponse) {
        const userClients = this.clients.get(userId);
        if (userClients) {
            const message = `data: ${JSON.stringify(data)}\n\n`;
            userClients.forEach(client => {
                client.write(message);
            });
        }
    }
}

export const notificationManager = NotificationManager.getInstance();
