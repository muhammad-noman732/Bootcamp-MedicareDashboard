export interface AnalyticsSummary {
    totalPatients: {
        count: number;
        growth: number;
    };
    monthlyAppointments: {
        count: number;
        growth: number;
    };
    completionRate: {
        percentage: number;
        completed: number;
        total: number;
    };
    activeTreatments: {
        count: number;
        growth: number;
    };
}

export interface PatientStatusStats {
    status: string;
    count: number;
    fill: string;
}

export interface AppointmentTrend {
    date: string;
    count: number;
}

export interface GenderStats {
    gender: string;
    count: number;
    fill: string;
}

export interface AgeGroupStats {
    group: string;
    count: number;
}

export interface AnalyticsData {
    summary: AnalyticsSummary;
    patientStatus: PatientStatusStats[];
    appointmentTrends: AppointmentTrend[];
    genderDistribution: GenderStats[];
    ageGroups: AgeGroupStats[];
}
