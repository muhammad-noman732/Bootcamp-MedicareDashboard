import { Patient, Prisma } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";

export class PatientRepository {


    // patientUncheckedCreateInput is used to create a patient without any relations as in this we can get the id of the user 
    async createPatient(data: Prisma.PatientUncheckedCreateInput): Promise<Patient> {
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
}


