import { Request, Response } from "express";
import { createPatientSchema, updatePatientSchema } from "../schema/patientSchema";
import { PatientServices } from "../services/patientServices";
import { InternalServerError, UnauthorizedError } from "../utils/appError";
import { asyncHandler } from "../utils/asyncHandler";
import { paginationQuerySchema } from "../schema/paginationQuerySchema";

export class PatientController {
  constructor(private patientServices: PatientServices) { }

  createPatient = asyncHandler(async (req: Request, res: Response) => {
    const body = createPatientSchema.parse(req.body);
    const userId = req.user.id;

    const patient = await this.patientServices.createPatient(body, userId);

    if (!patient) {
      throw new InternalServerError("Failed to create patient");
    }
    res.status(201).json({
      message: "Patient created successfully",
      patient,
    });
  });

  getPatient = asyncHandler(async (req: Request, res: Response) => {
    const patientId = req.params.id as string;
    const patient = await this.patientServices.getPatientById(patientId);
    if (!patient) {
      throw new UnauthorizedError("Failed to get patient ");
    }

    res.status(200).json({
      message: "Patient get Successfully",
      data: patient,
    });
  });

  deletePatient = asyncHandler(async (req: Request, res: Response) => {
    const patientId = req.params.id as string;
    const patient = await this.patientServices.deletePatient(patientId);
    if (!patient) {
      throw new UnauthorizedError("Failed to get patient ");
    }

    res.status(200).json({
      message: "Patient deleted Successfully",
      data: patient,
    });
  });

  updatePatient = asyncHandler(async (req: Request, res: Response) => {
    const patientId = req.params.id as string;
    const body = updatePatientSchema.parse(req.body);

    const patient = await this.patientServices.updatePatient(patientId, body);

    if (!patient) {
      throw new InternalServerError("Failed to update patient");
    }

    res.status(200).json({
      message: "Patient updated successfully",
      data: patient,
    });
  });


  getPatients = asyncHandler(async (req: Request, res: Response) => {
    const data = paginationQuerySchema.parse(req.query)

    const userId = req?.user.id;

    const result = await this.patientServices.getPatientsPaginated(userId, data);

    res.json({
      message: "Patients get Successfully",
      data: result,
    })

  })
}

