import React, { forwardRef } from "react"
import { cn } from "@/lib/utils"

type FormFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ id, name, label, type = "text", placeholder, className, ...props }, ref) => {
    return (
      <label htmlFor={id} className="flex flex-col gap-1 w-full">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <input
          ref={ref}
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          className={cn(
            "w-full bg-transparent border-b border-muted-foreground/40 py-1.5 text-lg font-bold text-foreground focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/30",
            className
          )}
          {...props}
        />
      </label>
    )
  }
)
FormField.displayName = "FormField"