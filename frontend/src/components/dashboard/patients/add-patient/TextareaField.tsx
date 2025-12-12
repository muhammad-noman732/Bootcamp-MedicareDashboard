import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

type TextareaFieldProps = {
  label: string
  id: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string
  rows?: number
}

export function TextareaField({
  label,
  id,
  value,
  onChange,
  placeholder,
  error,
  rows = 4,
}: TextareaFieldProps) {
  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={id} className="text-foreground">
          {label}
        </Label>
      )}
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "placeholder:text-muted-foreground",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-destructive"
        )}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

