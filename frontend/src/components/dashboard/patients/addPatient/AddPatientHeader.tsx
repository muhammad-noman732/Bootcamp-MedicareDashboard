import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"

type AddPatientHeaderProps = {
  onSave: () => void
}


export const AddPatientHeader = ({ onSave }: AddPatientHeaderProps) => {
  const navigate = useNavigate()

  return (
    <div className="h-[74px] bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-[26px]">
      <h1 className="text-2xl font-bold text-foreground">Add New Patient</h1>
      <div className="flex items-center gap-3 shrink-0">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/dashboard/patients")}
          className="border-primary text-primary hover:bg-muted"
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={onSave}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Save
        </Button>
      </div>
    </div>
  )
}

