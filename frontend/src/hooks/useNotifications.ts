import { useEffect, useState } from "react";
import { toast } from "sonner";

export interface AppNotification {
    id: string;
    title: string;
    message: string;
    type: "info" | "warning" | "success" | "error";
    isRead: boolean;
    link?: string;
    createdAt: string;
}

const API_BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000/api";

export const useNotifications = () => {
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {

        const fetchNotifications = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/notifications`, {
                    credentials: "include"
                });
                if (response.ok) {
                    const data: AppNotification[] = await response.json();
                    setNotifications(data);
                    setUnreadCount(data.filter((n) => !n.isRead).length);
                }
            } catch (error) {
                console.error("Failed to fetch notifications", error);
            }
        };

        fetchNotifications();

        // Listen for real-time updates via SSE
        const eventSource = new EventSource(`${API_BASE_URL}/notifications/stream`, {
            withCredentials: true
        });

        eventSource.onmessage = (event: MessageEvent) => {
            const newNotification: AppNotification = JSON.parse(event.data);

            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);

            // Show Toast
            const toastType = newNotification.type;
            const title = newNotification.title;
            const description = newNotification.message;
            const action = newNotification.link ? {
                label: "View",
                onClick: () => window.location.href = newNotification.link!
            } : undefined;

            if (toastType === "success") toast.success(title, { description, action });
            else if (toastType === "error") toast.error(title, { description, action });
            else if (toastType === "warning") toast.warning(title, { description, action });
            else toast.info(title, { description, action });
        };

        eventSource.onerror = (error: Event) => {
            console.error("SSE Connection error", error);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, []);

    const markAsRead = async (id: string) => {
        try {
            await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
                method: "PATCH",
                credentials: "include"
            });
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Failed to mark notification as read", error);
        }
    };

    const markAllRead = async () => {
        try {
            await fetch(`${API_BASE_URL}/notifications/read-all`, {
                method: "PATCH",
                credentials: "include"
            });
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error("Failed to mark all as read", error);
        }
    };

    return { notifications, unreadCount, markAsRead, markAllRead };
};
