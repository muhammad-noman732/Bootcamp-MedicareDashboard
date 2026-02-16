import { prisma } from "../lib/prisma.ts";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";

export class AnalyticsRepository {
    async getSummaryStats(userId: string) {
        const now = new Date();
        const startOfCurrentMonth = startOfMonth(now);
        const endOfCurrentMonth = endOfMonth(now);
        const startOfLastMonth = startOfMonth(subMonths(now, 1));
        const endOfLastMonth = endOfMonth(subMonths(now, 1));


        const totalPatients = await prisma.patient.count({
            where: { userId, deletedAt: null }
        });

        const lastMonthPatients = await prisma.patient.count({
            where: {
                userId,
                deletedAt: null,
                createdAt: { lt: startOfCurrentMonth }
            }
        });


        const currentMonthAppointments = await prisma.appointment.count({
            where: {
                userId,
                createdAt: { gte: startOfCurrentMonth, lte: endOfCurrentMonth }
            }
        });

        const lastMonthAppointments = await prisma.appointment.count({
            where: {
                userId,
                createdAt: { gte: startOfLastMonth, lte: endOfLastMonth }
            }
        });


        const totalTasks = await prisma.task.count({ where: { userId } });
        const completedTasks = await prisma.task.count({ where: { userId, isCompleted: true } });


        const activeTreatments = await prisma.patient.count({
            where: { userId, status: "on_treatment", deletedAt: null }
        });

        return {
            totalPatients,
            lastMonthPatients,
            currentMonthAppointments,
            lastMonthAppointments,
            totalTasks,
            completedTasks,
            activeTreatments
        };
    }

    async getPatientStatusDistribution(userId: string) {
        return prisma.patient.groupBy({
            by: ['status'],
            where: { userId, deletedAt: null },
            _count: {
                id: true
            }
        });
    }

    async getAppointmentTrends(userId: string, days: number = 7) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        return prisma.appointment.groupBy({
            by: ['createdAt'],
            where: {
                userId,
                createdAt: { gte: startDate }
            },
            _count: {
                id: true
            }
        });
    }

    async getGenderDistribution(userId: string) {
        return prisma.patient.groupBy({
            by: ['sex'],
            where: { userId, deletedAt: null },
            _count: {
                id: true
            }
        });
    }

    async getAgeData(userId: string) {
        return prisma.patient.findMany({
            where: { userId, deletedAt: null },
            select: { dateOfBirth: true }
        });
    }
}