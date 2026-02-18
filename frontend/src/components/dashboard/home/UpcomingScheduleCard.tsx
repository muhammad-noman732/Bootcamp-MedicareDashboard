import { Plus, ChevronDown, ChevronUp, Trash2, User, Edit } from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { format, isPast, addMinutes } from "date-fns";
import { NewAppointmentModal } from "../schedule/NewAppointmentModal";
import { UpdateAppointmentModal } from "../schedule/UpdateAppointmentModal";
import { cn } from "@/lib/utils";
import { useUpcomingSchedule } from "@/hooks/useUpcomingSchedule";

export function UpcomingScheduleCard() {
    const {
        appointments,
        isLoading,
        activeAppointmentId,
        selectedId,
        toggleExpand,
        handleDelete,
        isModalOpen,
        openModal,
        closeModal,
        isUpdateModalOpen,
        openUpdateModal,
        closeUpdateModal,
        appointmentToUpdate,
        beginAppointment,
        navigate
    } = useUpcomingSchedule();

    const timeMarkers = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

    return (
        <Card className="flex-[0_0_auto] w-full max-w-[384.41px] min-h-[624.66px] rounded-[4.9px] border-0 bg-white p-6 shadow-[0px_1.96px_15.69px_rgba(0,0,0,0.03)] relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between h-[30px] px-0 pt-0 mb-10">
                <CardTitle className="text-[15.69px] font-bold text-dark font-mukta">
                    Upcoming schedule
                </CardTitle>

                <Button
                    variant="ghost"
                    onClick={openModal}
                    className="flex items-center gap-2 text-primary hover:text-primary hover:bg-transparent p-0 h-auto font-mukta"
                >
                    <span className="text-[12.75px] font-semibold">
                        New appointment
                    </span>
                    <div className="relative flex items-center justify-center w-[24px] h-[24px] rounded border-[0.72px] border-border">
                        <Plus size={10} className="text-primary" strokeWidth={2.5} />
                    </div>
                </Button>
            </CardHeader>

            <CardContent className="px-0 pt-0 relative min-h-[500px]">
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : appointments.length === 0 ? (
                    <div className="text-center py-24 text-sm text-gray-3 bg-muted/30 rounded-lg border border-dashed border-border font-mukta">
                        No appointments for today
                    </div>
                ) : (
                    <div className="relative">
                        <div className="absolute left-[39px] top-0 bottom-0 w-[1px] bg-[#E0E0E0]" />

                        <div className="space-y-6">
                            {timeMarkers.map((hour) => {
                                const hourAppointments = appointments.filter(app => new Date(app.startTime).getHours() === hour);

                                return (
                                    <div key={hour} className="relative">
                                        <div className="flex items-start mb-4">
                                            <span className="w-[30px] text-[12px] text-[#828282] font-medium pt-[2px]">
                                                {hour}:00
                                            </span>
                                            <div
                                                className="absolute left-[34px] top-[6px] bg-black rounded-full z-10"
                                                style={{ width: '11px', height: '11px', opacity: 1 }}
                                            />
                                        </div>

                                        <div className="ml-[54px] space-y-4">
                                            {hourAppointments.map((app) => {
                                                const startTime = new Date(app.startTime);
                                                const endTime = app.endTime ? new Date(app.endTime) : addMinutes(startTime, app.duration || 30);
                                                const isPastApp = isPast(endTime);
                                                const isActive = app.id === activeAppointmentId;
                                                const isExpanded = selectedId === app.id;

                                                if (isActive || isExpanded) {
                                                    return (
                                                        <div key={app.id} className="relative">
                                                            {isActive && (
                                                                <div className="absolute -left-[19px] top-[14px] w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[6px] border-l-[#2F80ED] z-20" />
                                                            )}

                                                            <div
                                                                className={cn(
                                                                    "transition-all duration-300 rounded-[8px] border border-[#E0E0E0] p-0 bg-white shadow-sm",
                                                                    isExpanded && "shadow-[0px_2px_8px_rgba(0,0,0,0.05)]"
                                                                )}
                                                            >
                                                                <div
                                                                    className="flex items-center justify-between cursor-pointer px-3 py-2"
                                                                    onClick={() => toggleExpand(app.id)}
                                                                >
                                                                    <div className="flex items-center gap-3">
                                                                        <div className={cn(
                                                                            "w-[12px] h-[12px] rounded-full",
                                                                            isActive ? "bg-status-green" : "bg-status-blue"
                                                                        )} />
                                                                        <span className="text-[14px] font-bold tracking-widest text-dark font-mukta">
                                                                            {format(startTime, "H : mm")}
                                                                        </span>
                                                                        <span className="text-[14px] font-bold ml-1 text-dark font-mukta">
                                                                            {app.patient.forename} {app.patient.surname}
                                                                        </span>
                                                                    </div>

                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-[12px] text-[#A6A6A6] font-medium uppercase">Upcoming</span>
                                                                        <div className="flex items-center justify-center w-[24px] h-[24px] rounded-full border border-[#E0E0E0]">
                                                                            {isExpanded ? <ChevronUp size={16} className="text-[#2F80ED]" /> : <ChevronDown size={14} className="text-[#828282]" />}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {isExpanded && (
                                                                    <div className="px-3 pb-3 pt-2 border-t border-[#F2F2F2] animate-in slide-in-from-top-1 duration-200">
                                                                        <div className="space-y-4 mb-5 pt-2 px-1">
                                                                            <div className="flex items-start font-mukta">
                                                                                <span className="text-[13px] font-bold text-dark min-w-[80px]">Patient</span>
                                                                                <span className="text-[13px] font-medium text-gray-2">{app.patient.forename} {app.patient.surname}</span>
                                                                            </div>
                                                                            <div className="flex items-start font-mukta">
                                                                                <span className="text-[13px] font-bold text-dark min-w-[80px]">Time</span>
                                                                                <span className="text-[13px] font-medium text-gray-2">
                                                                                    {format(startTime, "H:mm")} - {format(endTime, "H:mm")}
                                                                                </span>
                                                                            </div>
                                                                            <div className="flex items-start font-mukta">
                                                                                <span className="text-[13px] font-bold text-dark min-w-[80px]">Purpose</span>
                                                                                <span className="text-[13px] font-medium text-gray-2">{app.purpose || "General check-up"}</span>
                                                                            </div>
                                                                        </div>

                                                                        <div className="flex items-center justify-between pt-3 border-t border-[#F2F2F2]">
                                                                            <div className="flex items-center gap-2">
                                                                                <button
                                                                                    onClick={(e) => { e.stopPropagation(); handleDelete(app.id); }}
                                                                                    className="flex items-center justify-center w-[36px] h-[36px] rounded-[6px] border border-border text-status-red hover:bg-red-50 transition-colors cursor-pointer"
                                                                                    title="Delete Appointment"
                                                                                >
                                                                                    <Trash2 size={18} />
                                                                                </button>
                                                                                <button
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        navigate("/dashboard/patients");
                                                                                    }}
                                                                                    className="flex items-center justify-center w-[36px] h-[36px] rounded-[6px] border border-border text-status-blue hover:bg-blue-50 transition-colors cursor-pointer"
                                                                                    title="View Patient Profile"
                                                                                >
                                                                                    <User size={18} />
                                                                                </button>
                                                                                <button
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        openUpdateModal(app);
                                                                                    }}
                                                                                    className="flex items-center justify-center w-[36px] h-[36px] rounded-[6px] border border-border text-status-blue hover:bg-blue-50 transition-colors cursor-pointer"
                                                                                    title="Edit Appointment"
                                                                                >
                                                                                    <Edit size={18} />
                                                                                </button>
                                                                            </div>
                                                                            <Button
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    beginAppointment(app);
                                                                                }}
                                                                                className="bg-primary hover:bg-primary/90 text-white text-[13px] font-bold px-5 h-[40px] rounded-[6px] font-mukta"
                                                                            >
                                                                                Begin appointment
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                }

                                                return (
                                                    <div key={app.id} className="relative py-1 cursor-pointer group hover:bg-gray-50/50 rounded transition-colors" onClick={() => toggleExpand(app.id)}>
                                                        <div className="flex items-center gap-4 ml-1">
                                                            <div className={cn(
                                                                "w-[10px] h-[10px] rounded-full",
                                                                isPastApp ? "bg-gray-4" : "bg-status-blue"
                                                            )} />
                                                            <span className={cn(
                                                                "text-[14px] font-bold min-w-[50px] tracking-wide font-mukta",
                                                                isPastApp ? "text-gray-4" : "text-dark"
                                                            )}>
                                                                {format(startTime, "H : mm")}
                                                            </span>
                                                            <span className={cn(
                                                                "text-[14px] font-medium font-mukta",
                                                                isPastApp ? "text-gray-4" : "text-gray-2"
                                                            )}>
                                                                {app.patient.forename} {app.patient.surname}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </CardContent>

            <div className="absolute bottom-6 right-6 flex items-center gap-1 text-[13px] font-bold text-primary cursor-pointer hover:underline font-mukta" onClick={() => navigate("/dashboard/schedule")}>
                <span>View all</span>
                <ChevronDown size={14} className="-rotate-90" />
            </div>

            <NewAppointmentModal
                open={isModalOpen}
                onClose={closeModal}
            />

            {appointmentToUpdate && (
                <UpdateAppointmentModal
                    open={isUpdateModalOpen}
                    onClose={closeUpdateModal}
                    appointment={appointmentToUpdate}
                />
            )}
        </Card>
    );
}