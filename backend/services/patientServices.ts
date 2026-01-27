import { PatientRepository } from "../repositories/patientRepository";
import { CreatePatientSchema, UpdatePatientSchema } from "../schema/patientSchema";
import { Patient, PatientStatus, Prisma } from "@prisma/client";
import { ConflictError, InternalServerError, NotFoundError } from "../utils/appError";
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
            deletedAt: null,
        };

        return await this.patientRepository.createPatient(createData);
    }


    async getPatientById(patientId: string): Promise<Patient> {
        const patinetData = await this.patientRepository.findPatientById(patientId);

        if (!patinetData) {
            throw new NotFoundError("Patient not found");
        }

        return patinetData;
    }

    async deletePatient(patinetId: string): Promise<Patient> {
        const deletedPatient = await this.patientRepository.deletePatient(
            patinetId
        );

        return deletedPatient;
    }

    async updatePatient(
        patientId: string,
        updateData: UpdatePatientSchema
    ): Promise<Patient> {
        const existingPatient = await this.patientRepository.findPatientById(patientId);

        if (!existingPatient) {
            throw new NotFoundError("Patient not found");
        }

        if (updateData.phoneNumber && updateData.phoneNumber !== existingPatient.phoneNumber) {
            const phoneExists = await this.patientRepository.findByPhoneNumber(
                updateData.phoneNumber
            );
            if (phoneExists) {
                throw new ConflictError("Phone number already in use by another patient");
            }
        }

        return await this.patientRepository.updatePatient(patientId, updateData);
    }



    async getPatientsPaginated(userId: string, query: PaginationQuery) {
        const { page, limit, search, status, sortBy, sortOrder } = query;

        const skip = (page - 1) * limit;

        const where: Prisma.PatientWhereInput = {
            userId: userId.trim(),
            deletedAt: null,
        };

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


    private generateRecordNumber(): string {
        const random = crypto.randomBytes(4).toString("hex").toUpperCase();
        return `REC-${random}`;
    }
}
