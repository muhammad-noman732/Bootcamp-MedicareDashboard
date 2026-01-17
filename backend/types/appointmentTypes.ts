import { Appointment, Patient, User } from "../generated/prisma/client";

export type AppointmentWithPatient = Appointment & { patient: Patient };

export type AppointmentWithDetails = Appointment & {
    patient: Patient;
    user: Pick<User, 'id' | 'email' | 'userName'>;
};

export type CreateAppointmentData = Pick<
    Appointment,
    'userId' | 'patientId' | 'startTime' | 'endTime' | 'clinic' | 'room' | 'purpose' | 'type' | 'status' | 'duration' | 'isOnline' | 'notifications'
>;

export type UpdateAppointmentData = Partial<Pick<
    Appointment,
    'startTime' | 'endTime' | 'clinic' | 'room' | 'purpose' | 'type' | 'status' | 'duration' | 'isOnline' | 'notifications'
>>;
