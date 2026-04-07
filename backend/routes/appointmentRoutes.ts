import express from "express";
import { AppointmentRepository } from "../repositories/appointmentRepository";
import { AppointmentService } from "../services/appointmentService";
import { AppointmentController } from "../controllers/appintmentController";
import { notificationServiceInstance } from "./notificationRoutes";
import { AuthMiddleware } from "../middlewares/authMiddleware";
import { JwtService } from "../lib/jwt";
import { validate } from "../middlewares/validateMiddleware";
import {
    appointmentSchema,
    updateAppointmentSchema,
    appointmentIdSchema,
    dateRangeQuerySchema
} from "../validations/appointmentValidation";

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
