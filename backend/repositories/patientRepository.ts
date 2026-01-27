import { Patient, Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

export class PatientRepository {

    async createPatient(data: Prisma.PatientUncheckedCreateInput): Promise<Patient> {
        return await prisma.patient.create({
            data
        });
    }


    async findByPhoneNumber(phoneNumber: string): Promise<Patient | null> {
        const patient = await prisma.patient.findFirst({
            where: {
                phoneNumber,
            }
        });

        if (!patient || patient.deletedAt) {
            return null;
        }

        return patient;
    }

    async findPatientById(id: string): Promise<Patient | null> {
        const patient = await prisma.patient.findUnique({
            where: { id }
        });

        if (!patient || patient.deletedAt) {
            return null;
        }

        return patient;
    }

    async deletePatient(id: string): Promise<Patient> {
        return await prisma.patient.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            }
        });
    }

    async updatePatient(id: string, data: Prisma.PatientUpdateInput): Promise<Patient> {
        return await prisma.patient.update({
            where: { id },
            data,
        });
    }



    async findPaginatedPatients(
        where: Prisma.PatientWhereInput,
        orderBy: Prisma.PatientOrderByWithRelationInput,
        skip: number,
        take: number
    ) {
        const [patients, totalCount] = await Promise.all([
            prisma.patient.findMany({
                where,
                orderBy,
                skip,
                take,
            }),
            prisma.patient.count({
                where,
            }),
        ]);

        return {
            patients,
            totalCount,
        };
    }

    async getGenderStats(userId: string) {
        const [total, male, female] = await Promise.all([
            prisma.patient.count({
                where: { userId, deletedAt: null }
            }),
            prisma.patient.count({
                where: { userId, sex: 'male', deletedAt: null }
            }),
            prisma.patient.count({
                where: { userId, sex: 'female', deletedAt: null }
            })
        ]);

        return { total, male, female };
    }
}


