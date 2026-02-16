import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type RecordNumberFieldProps = {
  isManual: boolean
  value: string
  onToggleManual: () => void
  onChange: (value: string) => void
  error?: string
}

export function RecordNumberField({
  isManual,
  value,
  onToggleManual,
  onChange,
  error,
}: RecordNumberFieldProps) {
  return (
    <div className="space-y-2">
      {!isManual ? (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Record number will be assigned automatically when you save.
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={onToggleManual}
            className="bg-muted text-foreground hover:bg-muted/80"
          >
            Assign manually
          </Button>
        </div>
      ) : (
        <div className="space-y-1">
          <Input
            id="recordNumber"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter record number"
            className={`w-full ${error ? "border-destructive" : ""}`}
          />
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </div>
      )}
    </div>
  )
}
