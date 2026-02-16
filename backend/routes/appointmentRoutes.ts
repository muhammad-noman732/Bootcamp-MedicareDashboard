import express from "express";
import { AppointmentRepository } from "../repositories/appointmentRepository.ts";
import { AppointmentService } from "../services/appointmentService.ts";
import { AppointmentController } from "../controllers/appintmentController.ts";
import { notificationServiceInstance } from "./notificationRoutes.ts";
import { AuthMiddleware } from "../middlewares/authMiddleware.ts";
import { JwtService } from "../lib/jwt.ts";
import { validate } from "../middlewares/validateMiddleware.ts";
import {
    appointmentSchema,
    updateAppointmentSchema,
    appointmentIdSchema,
    dateRangeQuerySchema
} from "../validations/appointmentSchema.ts";

const appointmentRouter = express.Router();

const repository = new AppointmentRepository();
const service = new AppointmentService(repository, notificationServiceInstance);
const controller = new AppointmentController(service);

const jwtService = new JwtService();
const authMiddleware = new AuthMiddleware(jwtService);

appointmentRouter.post('/', authMiddleware.authMiddleware, validate(appointmentSchema), controller.createAppointment);
appointmentRouter.get('/', authMiddleware.authMiddleware, controller.getAppointments);
appointmentRouter.get('/range', authMiddleware.authMiddleware, validate(dateRangeQuerySchema, 'query'), controller.getAppointmentsByDateRange);
appointmentRouter.get('/:id', authMiddleware.authMiddleware, validate(appointmentIdSchema, 'params'), controller.getAppointmentById);
appointmentRouter.put('/:id', authMiddleware.authMiddleware, validate(appointmentIdSchema, 'params'), validate(updateAppointmentSchema), controller.updateAppointment);
appointmentRouter.delete('/:id', authMiddleware.authMiddleware, validate(appointmentIdSchema, 'params'), controller.deleteAppointment);

export default appointmentRouter;