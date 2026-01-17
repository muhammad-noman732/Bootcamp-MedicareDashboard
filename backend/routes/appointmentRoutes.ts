import express from "express";
import { AppointmentRepository } from "../repositories/appointmentRepository.ts";
import { AppointmentService } from "../services/appointmentService.ts";
import { AppointmentController } from "../controllers/appintmentController.ts";
import { AuthMiddleware } from "../middlewares/authMiddleware.ts";
import { JwtService } from "../lib/jwt.ts";

const appointmentRouter = express.Router();

const repository = new AppointmentRepository();
const service = new AppointmentService(repository);
const controller = new AppointmentController(service);

const jwtService = new JwtService();
const authMiddleware = new AuthMiddleware(jwtService);

appointmentRouter.post('/', authMiddleware.authMiddleware, controller.createAppointment);
appointmentRouter.get('/', authMiddleware.authMiddleware, controller.getAppointments);
appointmentRouter.get('/range', authMiddleware.authMiddleware, controller.getAppointmentsByDateRange);
appointmentRouter.get('/:id', authMiddleware.authMiddleware, controller.getAppointmentById);
appointmentRouter.put('/:id', authMiddleware.authMiddleware, controller.updateAppointment);
appointmentRouter.delete('/:id', authMiddleware.authMiddleware, controller.deleteAppointment);

export default appointmentRouter;
