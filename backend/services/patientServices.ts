import { PatientRepository } from "../repositories/patientRepository";
import { CreatePatientSchema } from "../schema/patientSchema";
import { Patient } from "../generated/prisma/client";
import { ConflictError } from "../utils/appError";
import crypto from 'crypto';

export class PatientServices {
    constructor(
        private patientRepository: PatientRepository
    ) { }

    async createPatient(patientData: CreatePatientSchema): Promise<Patient> {

        const existingPatient = await this.patientRepository.findByPhoneNumber(patientData.phoneNumber);

        if (existingPatient) {
            throw new ConflictError("Patient with this phone number already exists");
        }

        const recordNumber = this.generateRecordNumber();

        const createData = {
            ...patientData,
            recordNumber,
            status: "on_treatment" as const
        };

        return await this.patientRepository.createPatient(createData);
    }

    private generateRecordNumber(): string {
        const random = crypto.randomBytes(4).toString('hex').toUpperCase();
        return `REC-${random}`;
    }
}