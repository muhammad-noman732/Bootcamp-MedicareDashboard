import { Task } from "../generated/prisma/client";

export interface ChartDataPoint {
    month: string;
    value: number;
}

export interface ConsultationStats {
    count: number;
    currentMonthCount: number;
    previousMonthCount: number;
    trend: string;
    chartData: ChartDataPoint[];
}

export interface PatientStats {
    total: number;
    male: number;
    female: number;
}

export interface taskStats {
    total: number;
    completed: number;
    pending: number;
    recent: Task[];
}

export interface DashboardStatsResponse {
    consultations: {
        offline: ConsultationStats;
        online: ConsultationStats;
    };
    patients: PatientStats;
    tasks: taskStats;
}