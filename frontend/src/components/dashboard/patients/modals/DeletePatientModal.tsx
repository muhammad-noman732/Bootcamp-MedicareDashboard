import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useDeletePatient } from "@/hooks/useDeletePatient"
import { Loader2 } from "lucide-react"

interface DeletePatientModalProps {
    isOpen: boolean
    onClose: () => void
    patientId: string
    patientName: string
}

export function DeletePatientModal({
    isOpen,
    onClose,
    patientId,
    patientName,
}: DeletePatientModalProps) {
    const { handleDelete, isLoading } = useDeletePatient()

    const onDelete = () => {
        handleDelete(patientId, patientName, onClose)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-[#1D1D1D]">Delete Patient</DialogTitle>
                    <DialogDescription className="text-[#828282]">
                        Are you sure you want to delete {patientName}? This action cannot be
                        undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-6 flex gap-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                        className="border-primary text-primary"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onDelete}
                        disabled={isLoading}
                        className="bg-[#EB5757] hover:bg-[#EB5757]/90"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            "Delete"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
