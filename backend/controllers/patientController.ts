import { Request, Response } from "express";
import { createPatientSchema } from "../schema/patientSchema";
import { PatientServices } from "../services/patientServices";
import { InternalServerError } from "../utils/appError";


export class PatientController {
    constructor(
        private patientServices: PatientServices
    ) {

    }

    async createPatient(req: Request, res: Response) {
        const body = createPatientSchema.parse(req.body);
        console.log("data of patinet schema ", body);

        const patient = await this.patientServices.createPatient(body)

        if (!patient) {
            throw new InternalServerError("Failed to create patient");
        }
        res.status(201).json({
            message: "Patient created successfully",
            patient
        })
    }
}