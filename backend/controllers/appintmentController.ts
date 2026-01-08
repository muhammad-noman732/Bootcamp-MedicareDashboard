import { asyncHandler } from "../utils/asyncHandler";
import type, { Request, Response } from "express";

export class AppointmentController {
    constructor(
        private appointmentService: AppointmentService
    ) {
    }

    createAppointment = asyncHandler(async (req: Request, res: Response) => {
        // const { patientId, date, time, purpose, room, clinic, type , status , isOnline   } = req.body;
        const data = req.body()
        const appointment = await this.appointmentService.createAppointment(data);


    })




}