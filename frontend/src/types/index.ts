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
