import React, { forwardRef } from "react"
import { cn } from "@/lib/utils"

type FormFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ id, name, label, type = "text", placeholder, className, ...props }, ref) => {
    return (
      <label htmlFor={id} className="flex flex-col gap-1 w-full h-[68px]">
        <span className="text-[16px] font-medium text-gray-2 leading-[100%] tracking-[0.001em] font-mukta">{label}</span>
        <input
          ref={ref}
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          className={cn(
            "w-full bg-transparent border-b border-gray-3 py-2 text-[22px] font-medium text-black leading-[100%] tracking-[0.0015em] font-mukta focus:outline-none focus:border-primary transition-colors placeholder:text-gray-3/30 h-full appearance-none",
            className
          )}
          {...props}
        />
      </label>
    )
  }
)
FormField.displayName = "FormField"