import { Appointment } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";
import type { AppointmentWithPatient, AppointmentWithDetails, CreateAppointmentData, UpdateAppointmentData } from "../types/appointmentTypes";
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';

export class AppointmentRepository {

    async isSlotAvailable(
        userId: string,
        startTime: Date,
        endTime: Date,
        clinic: string,
        room: string
    ): Promise<boolean> {
        const existingAppointment = await prisma.appointment.findFirst({
            where: {
                userId,
                clinic,
                room,
                OR: [
                    {
                        AND: [
                            { startTime: { lte: startTime } },
                            { endTime: { gte: startTime } },
                        ],
                    },
                    {
                        AND: [
                            { startTime: { lte: endTime } },
                            { endTime: { gte: endTime } },
                        ],
                    },
                    {
                        AND: [
                            { startTime: { gte: startTime } },
                            { endTime: { lte: endTime } },
                        ],
                    },
                ],
            },
        });

        return !existingAppointment;
    }

    async create(data: CreateAppointmentData): Promise<AppointmentWithDetails> {
        return await prisma.appointment.create({
            data,
            include: {
                patient: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        userName: true,
                    },
                },
            },
        });
    }

    async findByUserId(userId: string): Promise<AppointmentWithPatient[]> {
        return await prisma.appointment.findMany({
            where: { userId },
            include: { patient: true },
            orderBy: { startTime: "asc" },
        });
    }

    async findById(id: string): Promise<AppointmentWithDetails | null> {
        return await prisma.appointment.findUnique({
            where: { id },
            include: {
                patient: true,
                user: true,
            },
        });
    }

    async update(id: string, data: UpdateAppointmentData): Promise<Appointment> {
        return await prisma.appointment.update({
            where: { id },
            data,
        });
    }

    async delete(id: string): Promise<Appointment> {
        return await prisma.appointment.delete({
            where: { id },
        });
    }

    async findByDateRange(
        userId: string,
        startDate: Date,
        endDate: Date
    ): Promise<AppointmentWithPatient[]> {
        return await prisma.appointment.findMany({
            where: {
                userId,
                startTime: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            include: { patient: true },
            orderBy: { startTime: "asc" },
        });
    }

    async getMonthlyCount(
        userId: string,
        isOnline: boolean,
        monthsAgo: number = 0
    ): Promise<number> {
        const targetDate = subMonths(new Date(), monthsAgo);
        const monthStart = startOfMonth(targetDate);
        const monthEnd = endOfMonth(targetDate);

        return await prisma.appointment.count({
            where: {
                userId,
                isOnline,
                createdAt: {
                    gte: monthStart,
                    lte: monthEnd
                }
            }
        });
    }

    async getOfflineConsultationStats(userId: string) {
        const [currentMonth, previousMonth] = await Promise.all([
            this.getMonthlyCount(userId, false, 0),
            this.getMonthlyCount(userId, false, 1)
        ]);

        return { currentMonth, previousMonth };
    }

    async getOnlineConsultationStats(userId: string) {
        const [currentMonth, previousMonth] = await Promise.all([
            this.getMonthlyCount(userId, true, 0),
            this.getMonthlyCount(userId, true, 1)
        ]);

        return { currentMonth, previousMonth };
    }

    async getTotalCount(userId: string, isOnline: boolean): Promise<number> {
        return await prisma.appointment.count({
            where: { userId, isOnline }
        });
    }

    async getMonthlyConsultationData(
        userId: string,
        isOnline: boolean,
        monthsBack: number = 6
    ): Promise<Array<{ month: string; count: number }>> {
        const queries: Promise<{ month: string; count: number }>[] = [];

        for (let i = monthsBack - 1; i >= 0; i--) {
            const targetDate = subMonths(new Date(), i);
            const monthStart = startOfMonth(targetDate);
            const monthEnd = endOfMonth(targetDate);

            queries.push(
                prisma.appointment.count({
                    where: {
                        userId,
                        isOnline,
                        createdAt: {
                            gte: monthStart,
                            lte: monthEnd
                        }
                    }
                }).then(count => ({
                    month: format(targetDate, "MMMM"),
                    count
                }))
            );
        }

        return await Promise.all(queries);
    }
}