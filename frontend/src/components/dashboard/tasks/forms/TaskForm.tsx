import { Calendar } from "lucide-react";
import type { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { FormField } from "@/components/dashboard/patients/addPatient/FormField";
import { TextareaField } from "@/components/dashboard/patients/addPatient/TextareaField";
import { FormRow } from "@/components/dashboard/patients/addPatient/FormRow";
import type { CreateTaskFormValues } from "@/hooks/useCreateTask";

type TaskFormProps = {
    register: UseFormRegister<CreateTaskFormValues>;
    errors: FieldErrors<CreateTaskFormValues>;
    setValue: UseFormSetValue<CreateTaskFormValues>;
    watch: UseFormWatch<CreateTaskFormValues>;
    isLoading?: boolean;
};

export function TaskForm({
    register,
    errors,
    setValue,
    watch,
    isLoading,
}: TaskFormProps) {
    return (
        <div className="space-y-6">
            <FormRow label="Title" htmlFor="task-title">
                <FormField
                    id="task-title"
                    {...register("title")}
                    placeholder="Enter task title"
                    error={errors.title?.message}
                    onClear={() => setValue("title", "")}
                    value={watch("title")}
                    disabled={isLoading}
                />
            </FormRow>

            <FormRow label="Description" htmlFor="task-description">
                <TextareaField
                    id="task-description"
                    {...register("description")}
                    placeholder="Enter task description (optional)"
                    rows={4}
                    error={errors.description?.message}
                    disabled={isLoading}
                />
            </FormRow>

            <FormRow label="Date" htmlFor="task-date">
                <FormField
                    id="task-date"
                    type="date"
                    {...register("date")}
                    icon={<Calendar size={18} />}
                    iconPosition="left"
                    error={errors.date?.message}
                    disabled={isLoading}
                />
            </FormRow>

            <FormRow label="Status Text" htmlFor="task-statusText">
                <FormField
                    id="task-statusText"
                    {...register("statusText")}
                    placeholder="Enter status text (optional)"
                    error={errors.statusText?.message}
                    onClear={() => setValue("statusText", "")}
                    value={watch("statusText")}
                    disabled={isLoading}
                />
            </FormRow>
        </div>
    );
}
