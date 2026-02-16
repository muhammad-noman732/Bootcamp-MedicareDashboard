import { Filter, HelpCircle, Plus, Search } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"

type PatientsHeaderProps = {
  total: number
}

export function PatientsHeader({ total }: PatientsHeaderProps) {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-2 border-border rounded-4.9">
      <div>
        <h1 className="text-2xl font-medium text-dark font-mukta">
          Total Patients <span className="text-muted-foreground font-normal">({total})</span>
        </h1>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-lg border border-border hover:bg-muted"
          onClick={() => navigate("/dashboard/patients/add")}
        >
          <Plus size={20} className="text-foreground" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-lg border border-border hover:bg-muted"
        >
          <Search size={20} className="text-foreground" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-lg border border-border hover:bg-muted"
        >
          <Filter size={20} className="text-foreground" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-lg border border-border hover:bg-muted"
        >
          <HelpCircle size={20} className="text-foreground" />
        </Button>
      </div>
    </div>
  )
}