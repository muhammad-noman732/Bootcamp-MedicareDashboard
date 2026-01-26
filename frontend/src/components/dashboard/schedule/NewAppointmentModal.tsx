import { X, CheckCircle2, Clock, MapPin, User } from "lucide-react"
import { Loader2 } from "lucide-react"
import { useNewAppointmentModal } from "@/hooks/useNewAppointmentModal"

type NewAppointmentModalProps = {
  open: boolean
  onClose: () => void
}

const DURATION_OPTIONS = [10, 30, 45, 60, 90, 120] as const;

export function NewAppointmentModal({
  open,
  onClose,
}: NewAppointmentModalProps) {
  const {
    practitionerName,
    practitionerSpecialty,
    patientsData,
    isPatientsLoading,
    isLoading,
    onSubmit,
    register,
    errors,
    isEditingDateTime,
    toggleEditingDateTime,
    isEditingLocation,
    toggleEditingLocation,
    selectedStatus,
    selectedDuration,
    selectedType,
    selectedIsOnline,
    selectedDate,
    selectedTime,
    selectedClinic,
    selectedRoom,
    formatDate,
    setValue
  } = useNewAppointmentModal(onClose)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 py-8 sm:py-12 overflow-y-auto">
      <div className="w-full max-w-xl rounded-lg bg-white shadow-xl my-8">
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

        <form onSubmit={onSubmit} className="px-6 py-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-md border border-[#E0E0E0] px-3 py-3 text-left">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#4F4F4F]">
                <User size={18} className="text-[#0000AC]" />
                <span>Practitioner</span>
              </div>
              <div className="mt-2 text-sm text-[#1D1D1D] font-semibold">{practitionerName}</div>
              <div className="text-xs text-[#828282]">{practitionerSpecialty}</div>
            </div>

            <div className="rounded-md border border-[#E0E0E0] px-3 py-3 text-left">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#4F4F4F]">
                <Clock size={18} className="text-[#0000AC]" />
                <span>Date and Time</span>
              </div>
              {isEditingDateTime ? (
                <div className="mt-2 space-y-2">
                  <input
                    type="date"
                    {...register("date")}
                    className="w-full text-xs border border-[#E0E0E0] rounded px-2 py-1 focus:border-[#0000AC] focus:outline-none"
                  />
                  <input
                    type="time"
                    {...register("time")}
                    className="w-full text-xs border border-[#E0E0E0] rounded px-2 py-1 focus:border-[#0000AC] focus:outline-none"
                  />
                </div>
              ) : (
                <>
                  <div className="mt-2 text-sm text-[#1D1D1D] font-semibold">{formatDate(selectedDate)}</div>
                  <div className="text-xs text-[#828282]">{selectedTime}</div>
                </>
              )}
              <button
                type="button"
                onClick={toggleEditingDateTime}
                className="mt-1 text-xs font-semibold text-[#0000AC] hover:underline"
              >
                {isEditingDateTime ? "Done" : "Change"}
              </button>
            </div>

            <div className="rounded-md border border-[#E0E0E0] px-3 py-3 text-left">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#4F4F4F]">
                <MapPin size={18} className="text-[#0000AC]" />
                <span>Location</span>
              </div>
              {isEditingLocation ? (
                <div className="mt-2 space-y-2">
                  <input
                    type="text"
                    {...register("clinic")}
                    placeholder="Clinic name"
                    className="w-full text-xs border border-[#E0E0E0] rounded px-2 py-1 focus:border-[#0000AC] focus:outline-none"
                  />
                  <input
                    type="text"
                    {...register("room")}
                    placeholder="Room number"
                    className="w-full text-xs border border-[#E0E0E0] rounded px-2 py-1 focus:border-[#0000AC] focus:outline-none"
                  />
                </div>
              ) : (
                <>
                  <div className="mt-2 text-sm text-[#1D1D1D] font-semibold">{selectedClinic || "General clinic"}</div>
                  <div className="text-xs text-[#828282]">{selectedRoom || "Room 1"}</div>
                </>
              )}
              <button
                type="button"
                onClick={toggleEditingLocation}
                className="mt-1 text-xs font-semibold text-[#0000AC] hover:underline"
              >
                {isEditingLocation ? "Done" : "Change"}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-1 text-sm text-[#4F4F4F]">
              <label htmlFor="patientId">Patient</label>
              <select
                id="patientId"
                {...register("patientId")}
                disabled={isPatientsLoading || isLoading}
                className="rounded-md border border-[#E0E0E0] px-3 py-2 text-sm text-[#1D1D1D] focus:border-[#0000AC] focus:outline-none disabled:opacity-50"
              >
                <option value="">Select a patient</option>
                {patientsData?.data.data.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.forename} {patient.surname}
                  </option>
                ))}
              </select>
              {errors.patientId && (
                <p className="text-xs text-destructive">{errors.patientId.message}</p>
              )}
            </div>

            <label className="flex flex-col gap-1 text-sm text-[#4F4F4F]">
              Purpose of visit
              <textarea
                {...register("purpose")}
                rows={3}
                placeholder="Add a note"
                disabled={isLoading}
                className="rounded-md border border-[#E0E0E0] px-3 py-2 text-sm text-[#1D1D1D] focus:border-[#0000AC] focus:outline-none disabled:opacity-50"
              />
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <div className="text-sm font-medium text-[#4F4F4F]">Appointment Status</div>
                <div className="flex items-center gap-3">
                  <Pill
                    active={selectedStatus === "confirmation_required"}
                    onClick={() => setValue("status", "confirmation_required")}
                    disabled={isLoading}
                  >
                    Confirmation required
                  </Pill>
                  <Pill
                    active={selectedStatus === "confirmed"}
                    onClick={() => setValue("status", "confirmed")}
                    disabled={isLoading}
                  >
                    Confirmed
                  </Pill>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="text-sm font-medium text-[#4F4F4F]">Duration</div>
                <div className="flex flex-wrap gap-2">
                  {DURATION_OPTIONS.map((opt) => (
                    <Pill
                      key={opt}
                      active={opt === selectedDuration}
                      onClick={() => setValue("duration", opt)}
                      disabled={isLoading}
                    >
                      {opt}'
                    </Pill>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <div className="text-sm font-medium text-[#4F4F4F]">Appointment type</div>
                <div className="flex items-center gap-2">
                  <Pill
                    active={selectedType === "first_time"}
                    onClick={() => setValue("type", "first_time")}
                    disabled={isLoading}
                  >
                    First time
                  </Pill>
                  <Pill
                    active={selectedType === "follow_up"}
                    onClick={() => setValue("type", "follow_up")}
                    variant="secondary"
                    disabled={isLoading}
                  >
                    Follow up visit
                  </Pill>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="text-sm font-medium text-[#4F4F4F]">Online consultation</div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setValue("isOnline", !selectedIsOnline)}
                    disabled={isLoading}
                    className={`inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm font-semibold disabled:opacity-50 ${selectedIsOnline
                      ? "border-[#27AE60] text-[#27AE60]"
                      : "border-[#EB5757] text-[#EB5757]"
                      }`}
                  >
                    <X size={14} />
                    {selectedIsOnline ? "Yes" : "No"}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-md border border-[#E0E0E0] px-3 py-3">
              <CheckCircle2 size={18} className="text-[#4F4F4F] mt-0.5" />
              <div className="text-sm text-[#4F4F4F]">
                <div className="font-semibold">Send notifications</div>
                <div className="text-xs text-[#828282]">
                  Appointment confirmation and reminder messages will be automatically sent to clinic SMS notification settings.
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="text-sm font-medium text-[#4F4F4F] hover:text-[#0000AC] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center rounded-md bg-[#0000AC] px-4 py-2 text-sm font-semibold text-white hover:bg-[#00008c] transition-colors disabled:opacity-50 min-w-[100px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Pill({
  active,
  children,
  variant = "primary",
  onClick,
  disabled,
}: {
  active?: boolean
  children: React.ReactNode
  variant?: "primary" | "secondary"
  onClick?: () => void
  disabled?: boolean
}) {
  if (active) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="inline-flex items-center justify-center rounded-md bg-[#0000AC] px-3 py-1.5 text-xs font-semibold text-white shadow-sm disabled:opacity-50"
      >
        {children}
      </button>
    )
  }

  const classes =
    variant === "secondary"
      ? "bg-[#F2F2F2] text-[#4F4F4F]"
      : "bg-white text-[#4F4F4F] border border-[#E0E0E0]"

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-md px-3 py-1.5 text-xs font-semibold ${classes} disabled:opacity-50`}
    >
      {children}
    </button>
  )
}
