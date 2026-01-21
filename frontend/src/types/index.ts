export interface RegisterFormData {
    name: string;
    companyName: string;
    industry: string;
    employeeCount: string;
}

export interface RegisterFormErrors {
    name?: string;
    companyName?: string;
    industry?: string;
    employeeCount?: string;
}

export type DeltaType = "positive" | "negative";

export interface ChartPoint {
    month: string;
    desktop: number;
}

export interface AreaStatCardData {
    title: string;
    value: number;
    deltaLabel: string;
    deltaType?: DeltaType;
    chartData: ChartPoint[];
    strokeColor: string;
    strokeWidth: number;
    gradientId: string;
    gradientStops: { offset: number; color: string; opacity: number }[];
}

export interface RadialStatCardData {
    title: string;
    total: number;
    female: number;
    male: number;
}

export interface TaskItem {
    id: string;
    isCompleted: boolean;
    statusText: string;
    description: string;
    date: string;
}

export interface TasksCardData {
    tasks: TaskItem[];
}

export type PatientStatus = "recovered" | "awaiting_surgery" | "on_treatment";

export interface Patient {
    id: string;
    name: string;
    diagnosis: string;
    status: PatientStatus;
    lastAppointment: string;
    nextAppointment: string;
}

export interface PatientsData {
    total: number;
    patients: Patient[];
    currentPage: number;
    totalPages: number;
}

export type Sex = "male" | "female";

export interface AddPatientFormData {
    recordNumber?: string;
    forename: string;
    surname: string;
    dateOfBirth: string;
    sex: Sex | "";
    diagnosis: string;
    notes: string;
    phoneNumber: string;
}

export interface AddPatientFormErrors {
    recordNumber?: string;
    forename?: string;
    surname?: string;
    dateOfBirth?: string;
    sex?: string;
    diagnosis?: string;
    notes?: string;
    phoneNumber?: string;
}

export interface SignupFormValues {
    userName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface BackendErrorData {
    status: string;
    message: string;
    error?: unknown;
}

export interface VerifyEmailFormValues {
    otp: string;
}

export interface LoginFormValues {
    email: string;
    password: string;
}

export interface AddPatientFormValues {
    recordNumber?: string;
    forename: string;
    surname: string;
    dateOfBirth: string;
    sex: "male" | "female";
    diagnosis: string;
    notes?: string;
    phoneNumber: string;
    status: "recovered" | "awaiting_surgery" | "on_treatment";
}
