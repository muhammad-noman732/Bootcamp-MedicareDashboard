import { X } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

type FormFieldProps = {
  label: string
  id: string
  value: string
  onChange: (value: string) => void
  onClear?: () => void
  placeholder?: string
  error?: string
  type?: string
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
}

export function FormField({
  label,
  id,
  value,
  onChange,
  onClear,
  placeholder,
  error,
  type = "text",
  icon,
  iconPosition = "right",
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={id} className="text-foreground">
          {label}
        </Label>
      )}
      <div className="relative">
        {icon && iconPosition === "left" && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        <Input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            icon && iconPosition === "left" && "pl-10",
            onClear && value && "pr-10",
            error && "border-destructive"
          )}
        />
        {onClear && value && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X size={16} />
          </button>
        )}
        {icon && iconPosition === "right" && !onClear && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}

