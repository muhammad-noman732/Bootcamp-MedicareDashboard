import express from "express";
import { PatientRepository } from "../repositories/patientRepository";
import { PatientServices } from "../services/patientServices";
import { PatientController } from "../controllers/patientController";
import { AuthMiddleware } from "../middlewares/authMiddleware";
import { JwtService } from "../lib/jwt";

const patientRouter = express.Router();

const repository = new PatientRepository();
const services = new PatientServices(repository);
const controller = new PatientController(services);

const jwtService = new JwtService();
const authMiddleware = new AuthMiddleware(jwtService);

patientRouter.use(authMiddleware.authMiddleware);

patientRouter.post('/', controller.createPatient);
patientRouter.get('/', controller.getPatients);
patientRouter.get('/:id', controller.getPatient);
patientRouter.delete('/:id', controller.deletePatient);
patientRouter.put('/:id', controller.updatePatient);

export default patientRouter;
