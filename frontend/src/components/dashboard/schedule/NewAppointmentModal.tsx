import { X, Check, Bell, Clock, MapPin, User } from "lucide-react"
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
    onBeginAppointment,
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
      <div className="w-full max-w-162.5 rounded-lg bg-white shadow-xl my-8">
        <div className="flex items-center justify-between bg-[#0000AC] px-6 text-white h-15">
          <span className="text-[18px] font-semibold">New Appointment</span>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-full p-1 hover:bg-white/15 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="px-6 py-6 space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center pb-2 mt-5">
            <div className="flex flex-col items-center space-y-[7px]">
              <div className="flex items-center justify-center w-4 h-4">
                <User size={16} className="text-status-blue" />
              </div>
              <div className="font-['Mukta'] font-normal text-[18px] leading-[1.2] tracking-[0.005em] text-status-blue uppercase">
                Practitioner
              </div>
              <div className="font-['Mukta'] font-normal text-[14px] leading-[1.2] tracking-[0.0025em] text-dark">
                {practitionerName}
              </div>
              <div className="font-['Mukta'] font-normal text-[13px] leading-[1.2] text-gray-3">
                {practitionerSpecialty}
              </div>
            </div>
            <div className="flex flex-col items-center space-y-[7px]">
              <div className="flex items-center justify-center w-4 h-4">
                <Clock size={16} className="text-status-blue" />
              </div>
              <div className="font-['Mukta'] font-normal text-[18px] leading-[1.2] tracking-[0.005em] text-status-blue uppercase">
                Date and Time
              </div>
              {isEditingDateTime ? (
                <div className="space-y-1 w-full max-w-30">
                  <input
                    type="date"
                    {...register("date")}
                    className="w-full text-[12px] border border-gray-5 rounded px-2 py-1 focus:border-primary focus:outline-none"
                  />
                  <input
                    type="time"
                    {...register("time")}
                    className="w-full text-[12px] border border-gray-5 rounded px-2 py-1 focus:border-primary focus:outline-none"
                  />
                </div>
              ) : (
                <>
                  <div className="font-['Mukta'] font-normal text-[14px] leading-[1.2] tracking-[0.0025em] text-dark">
                    {formatDate(selectedDate)}
                  </div>
                  <div className="font-['Mukta'] font-semibold text-[14px] leading-[1.2] text-dark">
                    {selectedTime}
                  </div>
                </>
              )}
              <button
                type="button"
                onClick={toggleEditingDateTime}
                className="cursor-pointer font-['Mukta'] font-normal text-[12px] leading-none tracking-[0.004em] text-status-blue"
              >
                {isEditingDateTime ? "Done" : "Change"}
              </button>
            </div>

            <div className="flex flex-col items-center space-y-1.75">
              <div className="flex items-center justify-center w-4 h-4">
                <MapPin size={16} className="text-status-blue" />
              </div>
              <div className="font-['Mukta'] font-normal text-[18px] leading-[1.2] tracking-[0.005em] text-status-blue uppercase">
                Location
              </div>
              {isEditingLocation ? (
                <div className="space-y-1 w-full max-w-30">
                  <input
                    type="text"
                    {...register("clinic")}
                    placeholder="Clinic name"
                    className="w-full text-[12px] border border-gray-5 rounded px-2 py-1 focus:border-primary focus:outline-none"
                  />
                  <input
                    type="text"
                    {...register("room")}
                    placeholder="Room number"
                    className="w-full text-[12px] border border-gray-5 rounded px-2 py-1 focus:border-primary focus:outline-none"
                  />
                </div>
              ) : (
                <>
                  <div className="font-['Mukta'] font-normal text-[14px] leading-[1.2] tracking-[0.0025em] text-dark">
                    {selectedClinic || "General clinic"}
                  </div>
                  <div className="font-['Mukta'] font-semibold text-[14px] leading-[1.2] text-dark">
                    {selectedRoom || "Room 1"}
                  </div>
                </>
              )}
              <button
                type="button"
                onClick={toggleEditingLocation}
                className="cursor-pointer font-['Mukta'] font-normal text-[12px] leading-none tracking-[0.004em] text-status-blue"
              >
                {isEditingLocation ? "Done" : "Change"}
              </button>
            </div>
          </div>

          <div className="space-y-8 pt-6">
            <div className="flex items-center justify-between gap-4">
              <label
                htmlFor="patientId"
                className="font-['Mukta'] font-normal text-[18px] leading-[1.2] tracking-[0.005em] text-gray-7 min-w-45"
              >
                Patient
              </label>
              <div className="flex-1 max-w-100">
                <select
                  id="patientId"
                  {...register("patientId")}
                  disabled={isPatientsLoading || isLoading}
                  className="w-full border border-gray-5 rounded-md px-3 py-2 text-sm text-dark focus:border-[#0000AC] focus:outline-none focus:ring-0 disabled:opacity-50"
                >
                  <option value="">Select a patient</option>
                  {patientsData?.data.data.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.forename} {patient.surname}
                    </option>
                  ))}
                </select>
                {errors.patientId && (
                  <p className="mt-1 text-xs text-destructive">{errors.patientId.message}</p>
                )}
              </div>
            </div>
            <div className="flex items-start justify-between gap-4">
              <label
                htmlFor="purpose"
                className="font-['Mukta'] font-normal text-[18px] leading-[1.2] tracking-[0.005em] text-gray-7 min-w-45 mt-2"
              >
                Purpose of visit
              </label>
              <textarea
                {...register("purpose")}
                rows={3}
                placeholder="Add a note"
                disabled={isLoading}
                className="flex-1 max-w-100 border border-gray-5 rounded-md px-3 py-2 text-sm text-dark focus:border-[#0000AC] focus:outline-none focus:ring-0 disabled:opacity-50"
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div
                className="font-['Mukta'] font-normal text-[18px] leading-[1.2] tracking-[0.005em] text-gray-7 min-w-45"
              >
                Appointment Status
              </div>
              <div className="flex-1 max-w-100 flex items-center gap-3">
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
            <div className="flex items-center justify-between gap-4">
              <div
                className="font-['Mukta'] font-normal text-[18px] leading-[1.2] tracking-[0.005em] text-gray-7 min-w-45"
              >
                Duration
              </div>
              <div className="flex-1 max-w-100 flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {DURATION_OPTIONS.map((opt) => (
                  <Pill
                    key={opt}
                    active={opt === selectedDuration}
                    onClick={() => setValue("duration", opt)}
                    disabled={isLoading}
                    variant="secondary"
                    className="w-[44px] h-[44px] flex-shrink-0 p-0 rounded-[5px]"
                  >
                    <span className="text-[14px] font-normal">{opt}'</span>
                  </Pill>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div
                className="font-['Mukta'] font-normal text-[18px] leading-[1.2] tracking-[0.005em] text-gray-7 min-w-45"
              >
                Appointment type
              </div>
              <div className="flex-1 max-w-100 flex items-center gap-2">
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
            <div className="flex items-center justify-between gap-4">
              <div
                className="font-['Mukta'] font-normal text-[18px] leading-[1.2] tracking-[0.005em] text-gray-7 min-w-45"
              >
                Online consultation
              </div>
              <div className="flex-1 max-w-100 flex items-center">
                <button
                  type="button"
                  onClick={() => setValue("isOnline", !selectedIsOnline)}
                  disabled={isLoading}
                  className={`cursor-pointer inline-flex items-center gap-2 rounded-md border px-5 py-2.5 text-sm font-semibold disabled:opacity-50 ${selectedIsOnline
                    ? "border-status-green text-status-green"
                    : "border-status-red text-status-red"
                    }`}
                >
                  {selectedIsOnline ? (
                    <Check size={18} className="text-status-green" />
                  ) : (
                    <X size={18} className="text-status-red" />
                  )}
                  {selectedIsOnline ? "Yes" : "No"}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4 px-3 py-6 border-t border-gray-5 mt-4">
            <div className="flex items-center gap-4">
              <Bell size={24} className="text-gray-7" />
              <div className="font-['Mukta'] font-bold text-[18px] leading-none tracking-[0.5%] text-gray-7">
                Send notifications
              </div>
            </div>
            <div className="font-['Mukta'] font-normal text-[14px] leading-none tracking-[0.25%] text-gray-7">
              Appointment confirmation and reminder messages will be automatically sent to clinic SMS notification settings.
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center gap-4 pt-8">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="cursor-pointer text-sm font-semibold text-dark hover:text-[#0000AC] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onBeginAppointment}
              disabled={isLoading}
              className="inline-flex cursor-pointer items-center justify-center rounded-sm bg-[#0000AC] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#00008c] transition-colors disabled:opacity-50 min-w-[120px]"
            >
              Begin Appointment
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex cursor-pointer items-center justify-center border border-[#0000AC] rounded-sm bg-white px-8 py-2.5 text-sm font-semibold text-[#0000AC] hover:bg-gray-50 transition-colors disabled:opacity-50 min-w-20"
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
  className = "",
}: {
  active?: boolean
  children: React.ReactNode
  variant?: "primary" | "secondary"
  onClick?: () => void
  disabled?: boolean
  className?: string
}) {
  const baseClasses = "inline-flex items-center justify-center font-semibold disabled:opacity-50 shadow-sm transition-all"
  const sizeClasses = className.includes("w-") ? "" : "px-6 py-2.5 text-sm rounded-md"

  if (active) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`cursor-pointer ${baseClasses} ${sizeClasses} bg-[#0000AC] text-white ${className}`}
      >
        {children}
      </button>
    )
  }

  const variantClasses =
    variant === "secondary"
      ? "bg-[#F2F2F2] text-gray-7"
      : "bg-white text-gray-7 border border-gray-5"

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`cursor-pointer ${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
    >
      {children}
    </button>
  )
}