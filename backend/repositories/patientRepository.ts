import { Patient, Prisma } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";

export class PatientRepository {


    async createPatient(data: Prisma.PatientCreateInput): Promise<Patient> {
        return await prisma.patient.create({
            data,
        });
    }


    async findByPhoneNumber(phoneNumber: string): Promise<Patient | null> {
        return await prisma.patient.findFirst({
            where: {
                phoneNumber,
                deletedAt: null // Ignore deleted patients 
            }
        });
    }

    async findPatientById(id: string): Promise<Patient | null> {
        return await prisma.patient.findFirst({
            where: {
                id,
                deletedAt: null
            }
        });
    }

    async deletePatient(id: string): Promise<Patient> {
        return await prisma.patient.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            }
        });
    }
}
