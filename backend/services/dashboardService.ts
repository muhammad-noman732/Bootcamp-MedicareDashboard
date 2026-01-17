import { AppointmentRepository } from "../repositories/appointmentRepository";
import { PatientRepository } from "../repositories/patientRepository";
import { TaskRepository } from "../repositories/taskRepository";
import { DashboardStatsResponse } from "../types/dashboardTypes";

export class DashboardService {
    constructor(
        private appointmentRepository: AppointmentRepository,
        private patientRepository: PatientRepository,
        private taskRepository: TaskRepository
    ) { }

    // Helper: Calculate percentage trend
    private calculateTrend(current: number, previous: number): string {
        // Handle edge case: if previous month is 0
        // If current is also 0, trend is 0%
        if (previous === 0) {
            return current > 0 ? "+100%" : "0%";
        }

        const difference = current - previous;
        const percentage = (difference / previous) * 100;
        const rounded = percentage.toFixed(2);

        // Add + for positive values (negative values already have -)
        return percentage >= 0 ? `+${rounded}%` : `${rounded}%`;
    }

    async getDashboardStats(userId: string): Promise<DashboardStatsResponse> {
        // Run all independent queries in parallel for maximum performance
        const [
            offlineStats,
            onlineStats,
            offlineTotal,
            onlineTotal,
            patientStats,
            taskStats,
            recentTasks
        ] = await Promise.all([
            this.appointmentRepository.getOfflineConsultationStats(userId),
            this.appointmentRepository.getOnlineConsultationStats(userId),
            this.appointmentRepository.getTotalCount(userId, false),
            this.appointmentRepository.getTotalCount(userId, true),
            this.patientRepository.getGenderStats(userId),
            this.getTaskStats(userId),
            this.taskRepository.getRecentTasks(userId, 4)
        ]);

        // Calculate trends based on monthly comparison
        const offlineTrend = this.calculateTrend(
            offlineStats.currentMonth,
            offlineStats.previousMonth
        );

        const onlineTrend = this.calculateTrend(
            onlineStats.currentMonth,
            onlineStats.previousMonth
        );

        return {
            consultations: {
                offline: {
                    count: offlineTotal,
                    currentMonthCount: offlineStats.currentMonth,
                    previousMonthCount: offlineStats.previousMonth,
                    trend: offlineTrend,
                    chartData: [] // To be implemented with monthly aggregation later
                },
                online: {
                    count: onlineTotal,
                    currentMonthCount: onlineStats.currentMonth,
                    previousMonthCount: onlineStats.previousMonth,
                    trend: onlineTrend,
                    chartData: []
                }
            },
            patients: {
                total: patientStats.total,
                male: patientStats.male,
                female: patientStats.female
            },
            tasks: {
                total: taskStats.total,
                completed: taskStats.completed,
                pending: taskStats.pending,
                recent: recentTasks
            }
        };
    }

    private async getTaskStats(userId: string) {
        const [total, completed, pending] = await Promise.all([
            this.taskRepository.count({ userId }),
            this.taskRepository.count({ userId, isCompleted: true }),
            this.taskRepository.count({ userId, isCompleted: false })
        ]);

        return { total, completed, pending };
    }
}
