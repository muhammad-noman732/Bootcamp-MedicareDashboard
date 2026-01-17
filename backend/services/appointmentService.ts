import type { CreateAppointmentSchema, UpdateAppointmentSchema } from "../schema/appointmentSchema";
import { AppointmentRepository } from "../repositories/appointmentRepository";
import { BadRequestError, NotFoundError, UnauthorizedError, InternalServerError } from "../utils/appError";
import type { AppointmentWithPatient, AppointmentWithDetails } from "../types/appointmentTypes";

export class AppointmentService {

    constructor(
        private appointmentRepository: AppointmentRepository
    ) { }

    async createAppointment(
        userId: string,
        data: CreateAppointmentSchema
    ): Promise<AppointmentWithDetails> {

        const appointmentDate = new Date(data.date);

        if (isNaN(appointmentDate.getTime())) {
            throw new BadRequestError("Invalid date format");
        }

        const [hours, minutes] = data.time.split(":").map(Number);

        if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
            throw new BadRequestError("Invalid time format");
        }

        const startTime = new Date(appointmentDate);
        startTime.setHours(hours, minutes, 0, 0);

        const now = new Date();
        if (startTime < now) {
            throw new BadRequestError("Cannot create appointments in the past");
        }

        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + data.duration);

        const isAvailable = await this.appointmentRepository.isSlotAvailable(
            userId,
            startTime,
            endTime,
            data.clinic,
            data.room
        );

        if (!isAvailable) {
            throw new InternalServerError(
                `The time slot from ${startTime.toLocaleTimeString()} to ${endTime.toLocaleTimeString()} ` +
                `is already booked for ${data.clinic}, ${data.room}`
            );
        }

        const appointment = await this.appointmentRepository.create({
            userId,
            patientId: data.patientId,
            startTime,
            endTime,
            clinic: data.clinic,
            room: data.room,
            purpose: data.purpose ?? null,
            type: data.type,
            status: data.status,
            duration: data.duration,
            isOnline: data.isOnline,
            notifications: data.notifications,
        });

        return appointment;
    }

    async getUserAppointments(userId: string): Promise<AppointmentWithPatient[]> {
        return await this.appointmentRepository.findByUserId(userId);
    }

    async getAppointmentById(id: string): Promise<AppointmentWithDetails | null> {
        return await this.appointmentRepository.findById(id);
    }

    async updateAppointment(
        id: string,
        userId: string,
        data: UpdateAppointmentSchema
    ): Promise<AppointmentWithDetails> {
        const existingAppointment = await this.appointmentRepository.findById(id);

        if (!existingAppointment) {
            throw new NotFoundError("Appointment not found");
        }

        if (existingAppointment.userId !== userId) {
            throw new UnauthorizedError("Unauthorized to update this appointment");
        }

        const updateData: Record<string, unknown> = {};

        if (data.date || data.time || data.duration) {
            const appointmentDate = new Date(data.date || existingAppointment.startTime);
            const timeString = data.time ||
                `${existingAppointment.startTime.getHours()}:${existingAppointment.startTime.getMinutes()}`;

            const [hours, minutes] = timeString.split(":").map(Number);

            const startTime = new Date(appointmentDate);
            startTime.setHours(hours, minutes, 0, 0);

            const endTime = new Date(startTime);
            const duration = data.duration || existingAppointment.duration;
            endTime.setMinutes(endTime.getMinutes() + duration);

            updateData.startTime = startTime;
            updateData.endTime = endTime;
            updateData.duration = duration;
        }

        if (data.clinic !== undefined) updateData.clinic = data.clinic;
        if (data.room !== undefined) updateData.room = data.room;
        if (data.purpose !== undefined) updateData.purpose = data.purpose ?? null;
        if (data.type !== undefined) updateData.type = data.type;
        if (data.status !== undefined) updateData.status = data.status;
        if (data.isOnline !== undefined) updateData.isOnline = data.isOnline;
        if (data.notifications !== undefined) updateData.notifications = data.notifications;

        await this.appointmentRepository.update(id, updateData);

        const updatedAppointment = await this.appointmentRepository.findById(id);

        if (!updatedAppointment) {
            throw new InternalServerError("Failed to retrieve updated appointment");
        }

        return updatedAppointment;
    }


    async deleteAppointment(id: string, userId: string): Promise<void> {
        const existingAppointment = await this.appointmentRepository.findById(id);

        if (!existingAppointment) {
            throw new NotFoundError("Appointment");
        }

        if (existingAppointment.userId !== userId) {
            throw new UnauthorizedError("Unauthorized to delete this appointment");
        }

        await this.appointmentRepository.delete(id);
    }

    async getAppointmentsByDateRange(
        userId: string,
        startDate: Date,
        endDate: Date
    ): Promise<AppointmentWithPatient[]> {
        return await this.appointmentRepository.findByDateRange(userId, startDate, endDate);
    }
}
