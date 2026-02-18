import { forwardRef } from "react"
import { X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

type FormFieldProps = React.ComponentPropsWithoutRef<"input"> & {
  label?: string
  error?: string
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
  onClear?: () => void
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ id, label, error, icon, iconPosition = "right", onClear, className, value, ...props }, ref) => {
    const hasValue = value && String(value).length > 0

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
            ref={ref}
            id={id}
            value={value}
            className={cn(
              icon && iconPosition === "left" && "pl-10",
              onClear && hasValue && "pr-10",
              error && "border-destructive",
              className
            )}
            {...props}
          />
          {onClear && hasValue && (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
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
)

FormField.displayName = "FormField"