import { useDeletePatientMutation } from "@/lib/store/services/patient/patientApi";
import { toast } from "sonner";

export const useDeletePatient = () => {
    const [deletePatient, { isLoading }] = useDeletePatientMutation();

    const handleDelete = async (patientId: string, patientName: string, onSuccess?: () => void) => {
        try {
            await deletePatient(patientId).unwrap();
            toast.success("Patient deleted", {
                description: `${patientName} has been removed from the records.`,
            });
            if (onSuccess) onSuccess();
        } catch (error) {
            toast.error("Delete failed", {
                description: "Something went wrong while deleting the patient.",
            });
        }
    };

    return {
        handleDelete,
        isLoading,
    };
};