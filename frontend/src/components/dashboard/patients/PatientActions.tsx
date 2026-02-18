import { useState } from "react"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DeletePatientModal } from "./modals/DeletePatientModal"
import { UpdatePatientModal } from "./modals/UpdatePatientModal"
import type { Patient } from "@/types"

interface PatientActionsProps {
    patient: Patient
}

export function PatientActions({ patient }: PatientActionsProps) {
    const [showUpdate, setShowUpdate] = useState(false)
    const [showDelete, setShowDelete] = useState(false)

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="p-1 hover:bg-muted rounded-md transition-colors outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer">
                        <MoreHorizontal size={18} className="text-gray-3" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem
                        onClick={() => setShowUpdate(true)}
                        className="cursor-pointer gap-2 text-dark font-mukta"
                    >
                        <Pencil size={16} />
                        Update
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setShowDelete(true)}
                        className="cursor-pointer gap-2 text-status-red focus:text-status-red focus:bg-red-50 font-mukta"
                    >
                        <Trash2 size={16} />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <UpdatePatientModal
                isOpen={showUpdate}
                onClose={() => setShowUpdate(false)}
                patientId={patient.id}
            />

            <DeletePatientModal
                isOpen={showDelete}
                onClose={() => setShowDelete(false)}
                patientId={patient.id}
                patientName={patient.name}
            />
        </>
    )
}