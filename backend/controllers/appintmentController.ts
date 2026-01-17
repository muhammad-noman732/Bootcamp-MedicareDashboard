import { asyncHandler } from "../utils/asyncHandler";
import type { Request, Response } from "express";
import { AppointmentService } from "../services/appointmentService";
import { appointmentSchema, updateAppointmentSchema, appointmentIdSchema, dateRangeQuerySchema } from "../schema/appointmentSchema";
import { BadRequestError, InternalServerError, UnauthorizedError } from '../utils/appError';

export class AppointmentController {

    constructor(
        private appointmentService: AppointmentService
    ) { }

    createAppointment = asyncHandler(async (req: Request, res: Response) => {
        const data = appointmentSchema.parse(req.body);
        const userId = req.user.id;

        if (!userId) {
            throw new UnauthorizedError("Unauthorized to create appointment");
        }

        const appointment = await this.appointmentService.createAppointment(userId, data);

        res.status(201).json({
            status: "success",
            message: "Appointment created successfully",
            data: appointment
        });
    });

    getAppointments = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user.id;

        if (!userId) {
            throw new UnauthorizedError("Unauthorized to get appointments");
        }

        const appointments = await this.appointmentService.getUserAppointments(userId);

        res.status(200).json({
            status: "success",
            data: appointments,
            count: appointments.length
        });
    });

    getAppointmentById = asyncHandler(async (req: Request, res: Response) => {
        const { id } = appointmentIdSchema.parse(req.params);

        const appointment = await this.appointmentService.getAppointmentById(id);

        if (!appointment) {
            throw new InternalServerError("Appointment not found");
        }

        res.status(200).json({
            status: "success",
            data: appointment
        });
    });

    updateAppointment = asyncHandler(async (req: Request, res: Response) => {
        const { id } = appointmentIdSchema.parse(req.params);
        const userId = req.user.id;

        if (!userId) {
            throw new UnauthorizedError("Unauthorized to update appointment");
        }

        const updateData = updateAppointmentSchema.parse(req.body);

        const updatedAppointment = await this.appointmentService.updateAppointment(id, userId, updateData);

        res.status(200).json({
            status: "success",
            message: "Appointment updated successfully",
            data: updatedAppointment
        });
    });

    deleteAppointment = asyncHandler(async (req: Request, res: Response) => {
        const { id } = appointmentIdSchema.parse(req.params);
        const userId = req.user.id;

        if (!userId) {
            throw new UnauthorizedError("Unauthorized to delete appointment");
        }

        await this.appointmentService.deleteAppointment(id, userId);

        res.status(200).json({
            status: "success",
            message: "Appointment deleted successfully"
        });
    });

    getAppointmentsByDateRange = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user.id;
        const { startDate, endDate } = dateRangeQuerySchema.parse(req.query);

        if (!userId) {
            throw new UnauthorizedError("Unauthorized to get appointments by date range");
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        const appointments = await this.appointmentService.getAppointmentsByDateRange(userId, start, end);

        res.status(200).json({
            status: "success",
            data: appointments,
            count: appointments.length
        });
    });
}
