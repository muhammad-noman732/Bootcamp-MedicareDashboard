import { cn } from "@/lib/utils"
import type { Sex } from "@/types"

type SexToggleProps = {
  value: Sex | ""
  onChange: (value: Sex) => void
  error?: string
}

export function SexToggle({ value, onChange, error }: SexToggleProps) {
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange("male")}
          className={cn(
            "flex-1 px-4 py-2 rounded-md border text-sm font-medium transition-colors",
            value === "male"
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
          )}
        >
          Male
        </button>
        <button
          type="button"
          onClick={() => onChange("female")}
          className={cn(
            "flex-1 px-4 py-2 rounded-md border text-sm font-medium transition-colors",
            value === "female"
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
          )}
        >
          Female
        </button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

