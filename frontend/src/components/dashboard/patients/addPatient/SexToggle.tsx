import { forwardRef } from "react"
import { cn } from "@/lib/utils"

type Sex = "male" | "female"

type SexToggleProps = {
  value?: Sex
  onChange?: (value: Sex) => void
  error?: string
  disabled?: boolean
}

export const SexToggle = forwardRef<HTMLDivElement, SexToggleProps>(
  ({ value, onChange, error, disabled }, ref) => {
    return (
      <div ref={ref} className="space-y-2">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onChange?.("male")}
            disabled={disabled}
            className={cn(
              "flex-1 px-4 py-2 rounded-md border text-sm font-medium transition-colors cursor-pointer",
              value === "male"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted text-muted-foreground border-border hover:bg-muted/80",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            Male
          </button>
          <button
            type="button"
            onClick={() => onChange?.("female")}
            disabled={disabled}
            className={cn(
              "flex-1 px-4 py-2 rounded-md border text-sm font-medium transition-colors cursor-pointer",
              value === "female"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted text-muted-foreground border-border hover:bg-muted/80",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            Female
          </button>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    )
  }
)

SexToggle.displayName = "SexToggle"