import { cn } from "@/lib/utils"
import type { PatientStatus } from "@/types"

type StatusBadgeProps = {
  status: PatientStatus
}

const statusLabels: Record<PatientStatus, string> = {
  recovered: "Recovered",
  awaiting_surgery: "Awaiting surgery",
  on_treatment: "On treatment",
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case "recovered":
        return "bg-[#27AE60] text-white"
      case "awaiting_surgery":
        return "bg-[#2F80ED] text-white"
      case "on_treatment":
        return "bg-[#EB5757] text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
        getStatusStyles()
      )}
    >
      {statusLabels[status]}
    </span>
  )
}

