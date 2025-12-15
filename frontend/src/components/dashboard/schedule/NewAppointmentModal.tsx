import { X, CheckCircle2, Clock, MapPin, User, ChevronDown } from "lucide-react"
import { useMemo } from "react"

type AppointmentStatus = "confirmation-required" | "confirmed"
type AppointmentType = "first-time" | "follow-up"

type Practitioner = {
  name: string
  specialty: string
}

type Location = {
  clinic: string
  room: string
}

type NewAppointmentModalProps = {
  open: boolean
  onClose: () => void
  practitioner?: Practitioner
  dateLabel?: string
  timeLabel?: string
  location?: Location
}

const defaultPractitioner: Practitioner = {
  name: "John Doe",
  specialty: "General Doctor",
}

const defaultLocation: Location = {
  clinic: "General clinic",
  room: "Room 1",
}

export function NewAppointmentModal({
  open,
  onClose,
  practitioner = defaultPractitioner,
  dateLabel = "Tue, 26 October",
  timeLabel = "9:00",
  location = defaultLocation,
}: NewAppointmentModalProps) {
  const durationOptions = useMemo(() => ["10'", "30'", "45'", "60'", "90'", "120'"], [])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 py-8 sm:py-12">
      <div className="w-full max-w-xl rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between bg-[#0000AC] px-6 py-4 text-white">
          <span className="text-base font-semibold">New Appointment</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 hover:bg-white/15 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Top summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <SummaryItem
              icon={<User size={18} className="text-[#0000AC]" />}
              title="Practitioner"
              primary={practitioner.name}
              secondary={practitioner.specialty}
            />
            <SummaryItem
              icon={<Clock size={18} className="text-[#0000AC]" />}
              title="Date and Time"
              primary={dateLabel}
              secondary={timeLabel}
              actionLabel="Change"
            />
            <SummaryItem
              icon={<MapPin size={18} className="text-[#0000AC]" />}
              title="Location"
              primary={location.clinic}
              secondary={location.room}
              actionLabel="Change"
            />
          </div>

          {/* Form body */}
          <div className="space-y-4">
            <LabeledInput label="Patient" value="Faysal Kareem" />
            <LabeledTextArea label="Purpose of visit" placeholder="Add a note" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <StatusPicker />
              <DurationPicker options={durationOptions} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AppointmentTypePicker />
              <OnlineConsultationToggle />
            </div>

            <NotificationInfo />
          </div>

          {/* Footer actions */}
          <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-medium text-[#4F4F4F] hover:text-[#0000AC] transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-[#0000AC] px-4 py-2 text-sm font-semibold text-[#0000AC] hover:bg-[#0000AC]/10 transition-colors"
            >
              Begin Appointment
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md bg-[#0000AC] px-4 py-2 text-sm font-semibold text-white hover:bg-[#00008c] transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Subcomponents
function SummaryItem({
  icon,
  title,
  primary,
  secondary,
  actionLabel,
}: {
  icon: React.ReactNode
  title: string
  primary: string
  secondary: string
  actionLabel?: string
}) {
  return (
    <div className="rounded-md border border-[#E0E0E0] px-3 py-3 text-left">
      <div className="flex items-center gap-2 text-sm font-semibold text-[#4F4F4F]">
        {icon}
        <span>{title}</span>
      </div>
      <div className="mt-2 text-sm text-[#1D1D1D] font-semibold">{primary}</div>
      <div className="text-xs text-[#828282]">{secondary}</div>
      {actionLabel && (
        <button
          type="button"
          className="mt-1 text-xs font-semibold text-[#0000AC] hover:underline"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

function LabeledInput({ label, value }: { label: string; value?: string }) {
  return (
    <label className="flex flex-col gap-1 text-sm text-[#4F4F4F]">
      {label}
      <div className="flex items-center justify-between rounded-md border border-[#E0E0E0] px-3 py-2 text-sm text-[#1D1D1D]">
        <span>{value}</span>
        <ChevronDown size={16} className="text-[#828282]" />
      </div>
    </label>
  )
}

function LabeledTextArea({ label, placeholder }: { label: string; placeholder?: string }) {
  return (
    <label className="flex flex-col gap-1 text-sm text-[#4F4F4F]">
      {label}
      <textarea
        rows={3}
        placeholder={placeholder}
        className="rounded-md border border-[#E0E0E0] px-3 py-2 text-sm text-[#1D1D1D] focus:border-[#0000AC] focus:outline-none"
      />
    </label>
  )
}

function StatusPicker() {
  const selected: AppointmentStatus = "confirmed"
  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm font-medium text-[#4F4F4F]">Appointment Status</div>
      <div className="flex items-center gap-3">
        <Pill active={selected === "confirmation-required"}>Confirmation required</Pill>
        <Pill active={selected === "confirmed"}>Confirmed</Pill>
      </div>
    </div>
  )
}

function DurationPicker({ options }: { options: string[] }) {
  const selected = "60'"
  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm font-medium text-[#4F4F4F]">Duration</div>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <Pill key={opt} active={opt === selected}>
            {opt}
          </Pill>
        ))}
      </div>
    </div>
  )
}

function AppointmentTypePicker() {
  const selected: AppointmentType = "first-time"
  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm font-medium text-[#4F4F4F]">Appointment type</div>
      <div className="flex items-center gap-2">
        <Pill active={selected === "first-time"}>First time</Pill>
        <Pill active={selected === "follow-up"} variant="secondary">
          Follow up visit
        </Pill>
      </div>
    </div>
  )
}

function OnlineConsultationToggle() {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm font-medium text-[#4F4F4F]">Online consultation</div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-md border border-[#EB5757] px-3 py-1.5 text-sm font-semibold text-[#EB5757]"
        >
          <X size={14} />
          No
        </button>
      </div>
    </div>
  )
}

function NotificationInfo() {
  return (
    <div className="flex items-start gap-3 rounded-md border border-[#E0E0E0] px-3 py-3">
      <CheckCircle2 size={18} className="text-[#4F4F4F] mt-0.5" />
      <div className="text-sm text-[#4F4F4F]">
        <div className="font-semibold">Send notifications</div>
        <div className="text-xs text-[#828282]">
          Appointment confirmation and reminder messages will be automatically sent to clinic SMS notification settings.
        </div>
      </div>
    </div>
  )
}

function Pill({
  active,
  children,
  variant = "primary",
}: {
  active?: boolean
  children: React.ReactNode
  variant?: "primary" | "secondary"
}) {
  if (active) {
    return (
      <div className="inline-flex items-center justify-center rounded-md bg-[#0000AC] px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
        {children}
      </div>
    )
  }

  const classes =
    variant === "secondary"
      ? "bg-[#F2F2F2] text-[#4F4F4F]"
      : "bg-white text-[#4F4F4F] border border-[#E0E0E0]"

  return (
    <div className={`inline-flex items-center justify-center rounded-md px-3 py-1.5 text-xs font-semibold ${classes}`}>
      {children}
    </div>
  )
}
