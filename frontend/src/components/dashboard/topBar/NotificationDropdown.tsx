import { Bell, Check } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

export function NotificationDropdown() {
    const { notifications, unreadCount, markAsRead, markAllRead } = useNotifications();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="relative p-1 hover:text-primary transition-colors focus:outline-none">
                    <Bell size={20} strokeWidth={1.5} />
                    {unreadCount > 0 && (
                        <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 p-0" align="end">
                <DropdownMenuLabel className="p-4 flex items-center justify-between">
                    <span className="text-sm font-semibold">Notifications</span>
                    {unreadCount > 0 && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                markAllRead();
                            }}
                            className="text-[11px] text-primary hover:underline flex items-center gap-1"
                        >
                            <Check size={12} />
                            Mark all as read
                        </button>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-[400px] overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-8 text-center text-sm text-muted-foreground">
                            No notifications yet
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <DropdownMenuItem
                                key={notification.id}
                                className={cn(
                                    "flex flex-col items-start gap-1 p-4 cursor-pointer focus:bg-muted/50",
                                    !notification.isRead && "bg-primary/5"
                                )}
                                onClick={() => markAsRead(notification.id)}
                            >
                                <div className="flex w-full items-start justify-between gap-2">
                                    <span className={cn(
                                        "text-xs font-semibold",
                                        notification.isRead ? "text-[#4F4F4F]" : "text-black"
                                    )}>
                                        {notification.title}
                                    </span>
                                    <span className="text-[10px] text-[#828282] whitespace-nowrap">
                                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                    </span>
                                </div>
                                <p className="text-[11px] text-[#4F4F4F] leading-relaxed line-clamp-2">
                                    {notification.message}
                                </p>
                                {!notification.isRead && (
                                    <div className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
                                )}
                            </DropdownMenuItem>
                        ))
                    )}
                </div>
                {notifications.length > 0 && (
                    <>
                        <DropdownMenuSeparator />
                        <div className="p-2 text-center">
                            <button className="text-[11px] text-[#828282] hover:text-black">
                                View all notifications
                            </button>
                        </div>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
