import { Filter, HelpCircle, Plus, Printer } from "lucide-react"

type ScheduleHeaderProps = {
  dateRange: string
  onAdd?: () => void
  onFilter?: () => void
  onPrint?: () => void
  onHelp?: () => void
}

export function ScheduleHeader({
  dateRange,
  onAdd,
  onFilter,
  onPrint,
  onHelp,
}: ScheduleHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-3 rounded-xs">
      <div className="text-sm text-foreground">{dateRange}</div>
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={onAdd}
          className="h-10 w-10 rounded-lg border border-border hover:bg-muted flex items-center justify-center transition-colors"
        >
          <Plus size={20} className="text-foreground" />
        </button>
        <button
          type="button"
          onClick={onFilter}
          className="h-10 w-10 rounded-lg border border-border hover:bg-muted flex items-center justify-center transition-colors"
        >
          <Filter size={20} className="text-foreground" />
        </button>
        <button
          type="button"
          onClick={onPrint}
          className="h-10 w-10 rounded-lg border border-border hover:bg-muted flex items-center justify-center transition-colors"
        >
          <Printer size={20} className="text-foreground" />
        </button>
        <button
          type="button"
          onClick={onHelp}
          className="h-10 w-10 rounded-lg border border-border hover:bg-muted flex items-center justify-center transition-colors"
        >
          <HelpCircle size={20} className="text-foreground" />
        </button>
      </div>
    </div>
  )
}

