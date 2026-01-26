import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { FormField } from "@/components/dashboard/patients/addPatient/FormField"
import { SexToggle } from "@/components/dashboard/patients/addPatient/SexToggle"
import { TextareaField } from "@/components/dashboard/patients/addPatient/TextareaField"
import { FormRow } from "@/components/dashboard/patients/addPatient/FormRow"
import { useUpdatePatient } from "@/hooks/useUpdatePatient"
import { Loader2, Calendar } from "lucide-react"
import { Controller } from "react-hook-form"

interface UpdatePatientModalProps {
    isOpen: boolean
    onClose: () => void
    patientId: string
}

export function UpdatePatientModal({
    isOpen,
    onClose,
    patientId,
}: UpdatePatientModalProps) {
    const { form, isFetching, isUpdating, onSubmit } = useUpdatePatient({
        patientId,
        isOpen,
        onSuccess: onClose,
    })

    const {
        register,
        control,
        formState: { errors },
        setValue,
        watch,
    } = form

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-dark">
                        Update Patient Details
                    </DialogTitle>
                </DialogHeader>

                {isFetching ? (
                    <div className="flex items-center justify-center py-10">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <form onSubmit={onSubmit} className="space-y-4 py-4">
                        <FormRow label="Forename" htmlFor="upd-forename">
                            <FormField
                                id="upd-forename"
                                {...register("forename")}
                                placeholder="Enter forename"
                                error={errors.forename?.message}
                                onClear={() => setValue("forename", "")}
                                value={watch("forename")}
                            />
                        </FormRow>

                        <FormRow label="Surname" htmlFor="upd-surname">
                            <FormField
                                id="upd-surname"
                                {...register("surname")}
                                placeholder="Enter surname"
                                error={errors.surname?.message}
                                onClear={() => setValue("surname", "")}
                                value={watch("surname")}
                            />
                        </FormRow>

                        <FormRow label="Date of birth" htmlFor="upd-dob">
                            <FormField
                                id="upd-dob"
                                type="date"
                                {...register("dateOfBirth")}
                                icon={<Calendar size={18} />}
                                iconPosition="left"
                                error={errors.dateOfBirth?.message}
                            />
                        </FormRow>

                        <FormRow label="Sex">
                            <span className="sr-only">Sex</span>
                            <Controller
                                control={control}
                                name="sex"
                                render={({ field }) => (
                                    <SexToggle
                                        value={field.value}
                                        onChange={field.onChange}
                                        error={errors.sex?.message}
                                        disabled={isUpdating}
                                    />
                                )}
                            />
                        </FormRow>

                        <FormRow label="Diagnosis" htmlFor="upd-diagnosis">
                            <FormField
                                id="upd-diagnosis"
                                {...register("diagnosis")}
                                placeholder="Enter diagnosis"
                                error={errors.diagnosis?.message}
                            />
                        </FormRow>

                        <FormRow label="Phone number" htmlFor="upd-phone">
                            <FormField
                                id="upd-phone"
                                type="tel"
                                {...register("phoneNumber")}
                                placeholder="Enter phone number"
                                error={errors.phoneNumber?.message}
                            />
                        </FormRow>

                        <FormRow label="Notes" htmlFor="upd-notes">
                            <TextareaField
                                id="upd-notes"
                                {...register("notes")}
                                placeholder="Enter notes (optional)"
                                rows={3}
                            />
                        </FormRow>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={isUpdating}
                                className="border-primary text-primary"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isUpdating}
                                className="bg-primary hover:bg-primary/90 min-w-[100px]"
                            >
                                {isUpdating ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    "Update"
                                )}
                            </Button>
                        </div>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    )
}
