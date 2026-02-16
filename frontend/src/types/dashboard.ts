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

export interface TaskStats {
    total: number;
    completed: number;
    pending: number;
    recent: Array<{
        id: string;
        title: string;
        description: string | null;
        date: string | null;
        isCompleted: boolean;
        statusText: string | null;
        createdAt: string;
        updatedAt: string;
    }>;
}

export interface DashboardStatsResponse {
    consultations: {
        offline: ConsultationStats;
        online: ConsultationStats;
    };
    patients: PatientStats;
    tasks: TaskStats;
}

export interface GetDashboardStatsResponse {
    status: string;
    message: string;
    data: DashboardStatsResponse;
}