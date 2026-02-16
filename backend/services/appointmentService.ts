import type { CreateAppointmentSchema, UpdateAppointmentSchema } from "../validations/appointmentSchema";
import { AppointmentRepository } from "../repositories/appointmentRepository";
import { BadRequestError, NotFoundError, UnauthorizedError, InternalServerError } from "../utils/appError";
import type { AppointmentWithPatient, AppointmentWithDetails } from "../types/appointmentTypes";
import { NotificationService } from "./notificationService";

export class AppointmentService {

    constructor(
        private appointmentRepository: AppointmentRepository,
        private notificationService: NotificationService
    ) { }


    async createAppointment(
        userId: string,
        data: CreateAppointmentSchema
    ): Promise<AppointmentWithDetails> {

        const [year, month, day] = (data.date as string).split("-").map(Number);
        const [hours, minutes] = data.time.split(":").map(Number);

        if (isNaN(year) || isNaN(month) || isNaN(day)) {
            throw new BadRequestError("Invalid date format. Expected YYYY-MM-DD");
        }

        if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
            throw new BadRequestError("Invalid time format. Expected HH:mm");
        }

        const startTime = new Date(year, month - 1, day, hours, minutes, 0, 0);

        const now = new Date();
        if (startTime < now) {
            throw new BadRequestError(`Cannot create appointments in the past. Selection: ${startTime.toLocaleString()}, Current: ${now.toLocaleString()}`);
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

        await this.notificationService.createNotification(
            userId,
            "New Appointment Scheduled",
            `Appointment scheduled for ${startTime.toLocaleString()} at ${data.clinic}`,
            "success",
            `/dashboard/schedule`
        );

        return this.formatAppointment(appointment);
    }

    async getUserAppointments(userId: string): Promise<(AppointmentWithPatient & { formattedDate: string; formattedTime: string })[]> {
        const apps = await this.appointmentRepository.findByUserId(userId);
        return apps.map(app => this.formatAppointment(app));
    }

    async getAppointmentById(id: string): Promise<AppointmentWithDetails & { formattedDate: string; formattedTime: string } | null> {
        const app = await this.appointmentRepository.findById(id);
        return app ? this.formatAppointment(app) : null;
    }

    async updateAppointment(
        id: string,
        userId: string,
        data: UpdateAppointmentSchema
    ): Promise<AppointmentWithDetails & { formattedDate: string; formattedTime: string }> {
        const existingAppointment = await this.appointmentRepository.findById(id);

        if (!existingAppointment) {
            throw new NotFoundError("Appointment not found");
        }

        if (existingAppointment.userId !== userId) {
            throw new UnauthorizedError("Unauthorized to update this appointment");
        }

        const updateData: Partial<UpdateAppointmentSchema> & { startTime?: Date; endTime?: Date } = {};

        const getLocalDateParts = (d: Date) => ({
            year: d.getFullYear(),
            month: d.getMonth(),
            date: d.getDate(),
            hours: d.getHours(),
            minutes: d.getMinutes()
        });

        if (data.date || data.time || data.duration) {
            const currentParts = getLocalDateParts(existingAppointment.startTime);

            let year = currentParts.year;
            let month = currentParts.month;
            let day = currentParts.date;
            let hours = currentParts.hours;
            let minutes = currentParts.minutes;

            if (data.date && typeof data.date === "string") {
                const [y, m, dayPart] = data.date.split("-").map(Number);
                year = y;
                month = m - 1;
                day = dayPart;
            }

            if (data.time) {
                const [h, min] = data.time.split(":").map(Number);
                hours = h;
                minutes = min;
            }

            const startTime = new Date(year, month, day, hours, minutes, 0, 0);
            const duration = data.duration || existingAppointment.duration;
            const endTime = new Date(startTime.getTime() + duration * 60000);

            const now = new Date();
            if (startTime < now && startTime.getTime() !== existingAppointment.startTime.getTime()) {
                throw new BadRequestError(`Cannot reschedule appointment to a past time. Selection: ${startTime.toLocaleString()}`);
            }

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

        const updated = await this.appointmentRepository.findById(id);
        if (!updated) throw new InternalServerError("Update failed");

        return this.formatAppointment(updated);
    }

    private formatAppointment<T extends { startTime: Date }>(app: T) {
        const d = app.startTime;
        const formattedDate = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
        const formattedTime = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
        return { ...app, formattedDate, formattedTime };
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

        await this.notificationService.createNotification(
            userId,
            "Appointment Cancelled",
            `The appointment on ${existingAppointment.startTime.toLocaleString()} has been removed.`,
            "warning",
            `/dashboard/schedule`
        );
    }

    async getAppointmentsByDateRange(
        userId: string,
        startDate: Date,
        endDate: Date
    ): Promise<AppointmentWithPatient[]> {
        return await this.appointmentRepository.findByDateRange(userId, startDate, endDate);
    }
}