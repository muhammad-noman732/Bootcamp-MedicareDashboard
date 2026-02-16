import type { Patient } from "./patient";

export const AppointmentStatus = {
    Pending: "pending",
    ConfirmationRequired: "confirmation_required",
    Confirmed: "confirmed",
} as const;
export type AppointmentStatus = typeof AppointmentStatus[keyof typeof AppointmentStatus];

export const AppointmentType = {
    FirstTime: "first_time",
    FollowUp: "follow_up",
} as const;
export type AppointmentType = typeof AppointmentType[keyof typeof AppointmentType];

export interface Appointment {
    id: string;
    userId: string;
    patientId: string;
    startTime: string;
    endTime?: string;
    clinic?: string;
    room?: string;
    location?: string;
    purpose?: string;
    status: AppointmentStatus;
    duration: number;
    type: AppointmentType;
    isOnline: boolean;
    notifications: boolean;
    formattedDate: string;
    formattedTime: string;
    createdAt: string;
    updatedAt: string;
}

export interface AppointmentWithPatient extends Appointment {
    patient: Patient;
}

export interface AppointmentWithDetails extends Appointment {
    patient: Patient;
    user: {
        id: string;
        email: string;
        userName: string;
    };
}

export interface CreateAppointmentInput {
    patientId: string;
    date: string;
    time: string;
    duration: number;
    clinic?: string;
    room?: string;
    purpose?: string;
    type: AppointmentType;
    status: AppointmentStatus;
    isOnline: boolean;
    notifications: boolean;
}

export interface UpdateAppointmentInput {
    id: string;
    data: Partial<{
        date: string;
        time: string;
        duration: number;
        clinic: string;
        room: string;
        purpose: string;
        type: AppointmentType;
        status: AppointmentStatus;
        isOnline: boolean;
        notifications: boolean;
    }>;
}

export interface GetAppointmentsResponse {
    status: "success";
    data: AppointmentWithPatient[];
    count: number;
}

export interface GetAppointmentResponse {
    status: "success";
    data: AppointmentWithDetails;
}

export interface CreateAppointmentResponse {
    status: "success";
    message: string;
    data: AppointmentWithDetails;
}

export interface UpdateAppointmentResponse {
    status: "success";
    message: string;
    data: AppointmentWithDetails;
}

export interface DeleteAppointmentResponse {
    status: "success";
    message: string;
}

export interface DateRangeQueryParams {
    startDate: string;  
    endDate: string;  
}