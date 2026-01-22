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

    private calculateTrend(current: number, previous: number): string {
       
        if (previous === 0) {
            return current > 0 ? "+100%" : "0%";
        }

        const difference = current - previous;
        const percentage = (difference / previous) * 100;
        const rounded = percentage.toFixed(2);

        return percentage >= 0 ? `+${rounded}%` : `${rounded}%`;
    }

    async getDashboardStats(userId: string): Promise<DashboardStatsResponse> {
        const [
            offlineStats,
            onlineStats,
            offlineTotal,
            onlineTotal,
            patientStats,
            taskStats,
            recentTasks,
            offlineChartData,
            onlineChartData
        ] = await Promise.all([
            this.appointmentRepository.getOfflineConsultationStats(userId),
            this.appointmentRepository.getOnlineConsultationStats(userId),
            this.appointmentRepository.getTotalCount(userId, false),
            this.appointmentRepository.getTotalCount(userId, true),
            this.patientRepository.getGenderStats(userId),
            this.getTaskStats(userId),
            this.taskRepository.getRecentTasks(userId, 4),
            this.appointmentRepository.getMonthlyConsultationData(userId, false, 6),
            this.appointmentRepository.getMonthlyConsultationData(userId, true, 6)
        ]);

        
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
                    chartData: offlineChartData.map(item => ({
                        month: item.month,
                        value: item.count
                    }))
                },
                online: {
                    count: onlineTotal,
                    currentMonthCount: onlineStats.currentMonth,
                    previousMonthCount: onlineStats.previousMonth,
                    trend: onlineTrend,
                    chartData: onlineChartData.map(item => ({
                        month: item.month,
                        value: item.count
                    }))
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
