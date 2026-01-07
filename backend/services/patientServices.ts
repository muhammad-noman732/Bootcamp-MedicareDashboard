import { PatientRepository } from "../repositories/patientRepository";
import { CreatePatientSchema } from "../schema/patientSchema";
import { Patient, PatientStatus, Prisma } from "../generated/prisma/client";
import { ConflictError, InternalServerError } from "../utils/appError";
import crypto from "crypto";
import { PaginationQuery } from "../schema/paginationQuerySchema";

export class PatientServices {
    constructor(private patientRepository: PatientRepository) { }

    async createPatient(
        patientData: CreatePatientSchema,
        userId: string
    ): Promise<Patient> {
        const existingPatient = await this.patientRepository.findByPhoneNumber(
            patientData.phoneNumber
        );

        if (existingPatient) {
            throw new ConflictError("Patient with this phone number already exists");
        }

        const recordNumber = this.generateRecordNumber();

        const createData = {
            ...patientData,
            recordNumber,
            status: "on_treatment" as const,
            userId,
        };

        return await this.patientRepository.createPatient(createData);
    }

    // getPatient by id
    async getPatientById(patientId: string): Promise<Patient> {
        const patinetData = await this.patientRepository.findPatientById(patientId);

        if (!patinetData) {
            throw new InternalServerError("Failed to get patient");
        }

        return patinetData;
    }

    async deletePatient(patinetId: string): Promise<Patient> {
        const deletedPatient = await this.patientRepository.deletePatient(
            patinetId
        );

        return deletedPatient;
    }



    async getPatientsPaginated(userId: string, query: PaginationQuery) {
        const { page, limit, search, status, sortBy, sortOrder } = query;

        const skip = (page - 1) * limit;

        // where condition .
        // where userId (for doctor referral and deletedAt null for not deleted)
        const where: Prisma.PatientWhereInput = {
            userId,
            deletedAt: null,
        };

        // for search  condition
        // search in forename, surname, diagnosis, phoneNumber, recordNumber
        // should contain any of these 
        if (search) {
            where.OR = [
                { forename: { contains: search, mode: "insensitive" } },
                { surname: { contains: search, mode: "insensitive" } },
                { diagnosis: { contains: search, mode: "insensitive" } },
                { phoneNumber: { contains: search, mode: "insensitive" } },
                { recordNumber: { contains: search, mode: "insensitive" } },
            ];
        }

        if (status) {
            where.status = status as PatientStatus;
        }

        const orderBy: Prisma.PatientOrderByWithRelationInput = sortBy
            ? { [sortBy]: sortOrder }
            : { createdAt: "desc" };

        const { patients, totalCount } =
            await this.patientRepository.findPaginatedPatients(
                where,
                orderBy,
                skip,
                limit
            );

        const totalPages = Math.ceil(totalCount / limit);

        return {
            data: patients,
            pagination: {
                currentPage: page,
                totalPages,
                totalRecords: totalCount,
                recordsPerPage: limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        };
    }

    //   Private method of class
    private generateRecordNumber(): string {
        const random = crypto.randomBytes(4).toString("hex").toUpperCase();
        return `REC-${random}`;
    }
}


