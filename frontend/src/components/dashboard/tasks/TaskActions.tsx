import { useState } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UpdateTaskModal } from "./modals/UpdateTaskModal";
import { DeleteTaskModal } from "./modals/DeleteTaskModal";
import type { Task } from "@/types/task";

interface TaskActionsProps {
    task: Task;
}

export function TaskActions({ task }: TaskActionsProps) {
    const [showUpdate, setShowUpdate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="p-1 hover:bg-muted rounded-md transition-colors outline-none focus:ring-2 focus:ring-primary/20">
                        <MoreHorizontal size={18} className="text-[#828282]" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem
                        onClick={() => setShowUpdate(true)}
                        className="cursor-pointer gap-2 text-[#1D1D1D]"
                    >
                        <Pencil size={16} />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setShowDelete(true)}
                        className="cursor-pointer gap-2 text-[#EB5757] focus:text-[#EB5757] focus:bg-red-50"
                    >
                        <Trash2 size={16} />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <UpdateTaskModal
                isOpen={showUpdate}
                onClose={() => setShowUpdate(false)}
                taskId={task.id}
            />

            <DeleteTaskModal
                isOpen={showDelete}
                onClose={() => setShowDelete(false)}
                taskId={task.id}
                taskTitle={task.title}
            />
        </>
    );
}