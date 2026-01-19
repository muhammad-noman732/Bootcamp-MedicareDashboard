import type { ApiResponse, PaginatedResponse } from "./api";

export type PatientStatus = "recovered" | "awaiting_surgery" | "on_treatment";
export type Sex = "male" | "female";

export interface Patient {
    id: string;
    recordNumber: string;
    forename: string;
    surname: string;
    dateOfBirth: string;
    sex: Sex;
    diagnosis: string;
    notes?: string;
    phoneNumber: string;
    status: PatientStatus;
    userId: string;
    createdAt: string;
    updatedAt: string;
}



export interface CreatePatientInput {
    forename: string;
    surname: string;
    dateOfBirth: string;
    sex: Sex;
    diagnosis: string;
    notes?: string;
    phoneNumber: string;
    status: PatientStatus;
}

export interface UpdatePatientInput {
    id: string;
    data: Partial<Omit<Patient, 'id' | 'createdAt' | 'updatedAt' | 'userId'>>;
}

export interface PatientQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: PatientStatus;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}


export interface CreatePatientResponse {
    status: "success" | "error" | "fail";
    message: string;
    patient: Patient;
}

export type GetPatientResponse = ApiResponse<Patient>;
export type GetPatientsResponse = ApiResponse<PaginatedResponse<Patient>>;
export type UpdatePatientResponse = ApiResponse<Patient>;
export type DeletePatientResponse = ApiResponse<Patient>;
