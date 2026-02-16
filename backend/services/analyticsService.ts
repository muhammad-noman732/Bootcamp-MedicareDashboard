import type { AnalyticsRepository } from "../repositories/analyticsRepository.ts";
import type {
    AnalyticsData,
    AnalyticsSummary,
    PatientStatusStats,
    AppointmentTrend,
    GenderStats,
    AgeGroupStats
} from "../types/analyticsTypes";
import { format, differenceInYears } from "date-fns";

export class AnalyticsService {
    constructor(private analyticsRepository: AnalyticsRepository) { }

    private calculateGrowth(current: number, previous: number): number {
        if (previous === 0) return current > 0 ? 100 : 0;
        return Number(((current - previous) / previous * 100).toFixed(1));
    }

    async getDashboardAnalytics(userId: string): Promise<AnalyticsData> {
        const [
            summaryData,
            statusDist,
            trends,
            genderDist,
            ageData
        ] = await Promise.all([
            this.analyticsRepository.getSummaryStats(userId),
            this.analyticsRepository.getPatientStatusDistribution(userId),
            this.analyticsRepository.getAppointmentTrends(userId, 30),  
            this.analyticsRepository.getGenderDistribution(userId),
            this.analyticsRepository.getAgeData(userId)
        ]);

        const summary: AnalyticsSummary = {
            totalPatients: {
                count: summaryData.totalPatients,
                growth: this.calculateGrowth(summaryData.totalPatients, summaryData.lastMonthPatients)
            },
            monthlyAppointments: {
                count: summaryData.currentMonthAppointments,
                growth: this.calculateGrowth(summaryData.currentMonthAppointments, summaryData.lastMonthAppointments)
            },
            completionRate: {
                percentage: summaryData.totalTasks > 0 ? Math.round((summaryData.completedTasks / summaryData.totalTasks) * 100) : 0,
                completed: summaryData.completedTasks,
                total: summaryData.totalTasks
            },
            activeTreatments: {
                count: summaryData.activeTreatments,
                growth: 0
            }
        };

        const statusColors: Record<string, string> = {
            recovered: "#10b981",
            on_treatment: "#3b82f6",
            awaiting_surgery: "#f59e0b"
        };

        const patientStatus: PatientStatusStats[] = statusDist.map(item => ({
            status: item.status.replace('_', ' ').charAt(0).toUpperCase() + item.status.replace('_', ' ').slice(1),
            count: item._count.id,
            fill: statusColors[item.status] || "#94a3b8"
        }));


        const trendMap = new Map<string, number>();
        trends.forEach(item => {
            const dateStr = format(new Date(item.createdAt), "MMM dd");
            trendMap.set(dateStr, (trendMap.get(dateStr) || 0) + item._count.id);
        });

        const appointmentTrends: AppointmentTrend[] = Array.from(trendMap.entries()).map(([date, count]) => ({
            date,
            count
        })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        const genderColors: Record<string, string> = {
            male: "#0ea5e9",
            female: "#ec4899"
        };

        const genderDistribution: GenderStats[] = genderDist.map(item => ({
            gender: item.sex.charAt(0).toUpperCase() + item.sex.slice(1),
            count: item._count.id,
            fill: genderColors[item.sex] || "#94a3b8"
        }));


        const ageGroupsMap = {
            "0-18": 0,
            "19-35": 0,
            "36-50": 0,
            "51-70": 0,
            "70+": 0
        };

        ageData.forEach(p => {
            const age = differenceInYears(new Date(), new Date(p.dateOfBirth));
            if (age <= 18) ageGroupsMap["0-18"]++;
            else if (age <= 35) ageGroupsMap["19-35"]++;
            else if (age <= 50) ageGroupsMap["36-50"]++;
            else if (age <= 70) ageGroupsMap["51-70"]++;
            else ageGroupsMap["70+"]++;
        });

        const ageGroups: AgeGroupStats[] = Object.entries(ageGroupsMap).map(([group, count]) => ({
            group,
            count
        }));

        return {
            summary,
            patientStatus,
            appointmentTrends,
            genderDistribution,
            ageGroups
        };
    }
}