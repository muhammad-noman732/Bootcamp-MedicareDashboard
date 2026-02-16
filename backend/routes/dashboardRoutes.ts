import express from "express";
import { DashboardController } from "../controllers/dashboardController";
import { DashboardService } from "../services/dashboardService";
import { AppointmentRepository } from "../repositories/appointmentRepository";
import { PatientRepository } from "../repositories/patientRepository";
import { TaskRepository } from "../repositories/taskRepository";
import { AuthMiddleware } from "../middlewares/authMiddleware";
import { JwtService } from "../lib/jwt";
import { prisma } from "../lib/prisma";

const dashboardRouter = express.Router();

const appointmentRepository = new AppointmentRepository();
const patientRepository = new PatientRepository();
const taskRepository = new TaskRepository();

const dashboardService = new DashboardService(
    appointmentRepository,
    patientRepository,
    taskRepository
);

const dashboardController = new DashboardController(dashboardService);

const jwtService = new JwtService();
const authMiddleware = new AuthMiddleware(jwtService);

dashboardRouter.get(
    '/stats',
    authMiddleware.authMiddleware,
    dashboardController.getStats
);

export default dashboardRouter;