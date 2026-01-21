import { Label } from "@/components/ui/label"

type FormRowProps = {
  label: string
  htmlFor?: string
  children: React.ReactNode
}

export function FormRow({ label, htmlFor, children }: FormRowProps) {
  return (
    <div className="grid grid-cols-[200px_1fr] gap-6 items-start">
      <Label htmlFor={htmlFor} className="text-foreground pt-2">
        {label}
      </Label>
      <div>{children}</div>
    </div>
  )
}

