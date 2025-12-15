import { cn } from "@/lib/utils"

type FormFieldProps = {
  id: string
  name: string
  label: string
  type?: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const FormField = ({
  id,
  name,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
}: FormFieldProps) => {
  return (
    <label htmlFor={id} className="flex flex-col gap-1">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={cn(
          "w-full bg-transparent border-b border-muted-foreground/40 py-1.5 text-lg font-bold text-foreground focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/30"
        )}
      />
    </label>
  )
}
