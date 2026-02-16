import express from "express";
import { PatientRepository } from "../repositories/patientRepository";
import { PatientServices } from "../services/patientServices";
import { PatientController } from "../controllers/patientController";
import { AuthMiddleware } from "../middlewares/authMiddleware";
import { JwtService } from "../lib/jwt";
import { validate } from "../middlewares/validateMiddleware.ts";
import { createPatientSchema, updatePatientSchema } from "../validations/patientSchema.ts";
import { paginationQuerySchema } from "../validations/paginationQuerySchema.ts";

const patientRouter = express.Router();

const repository = new PatientRepository();
const services = new PatientServices(repository);
const controller = new PatientController(services);

const jwtService = new JwtService();
const authMiddleware = new AuthMiddleware(jwtService);

patientRouter.use(authMiddleware.authMiddleware);

patientRouter.post('/', validate(createPatientSchema), controller.createPatient);
patientRouter.get('/', validate(paginationQuerySchema, 'query'), controller.getPatients);
patientRouter.get('/:id', controller.getPatient);
patientRouter.delete('/:id', controller.deletePatient);
patientRouter.put('/:id', validate(updatePatientSchema), controller.updatePatient);

export default patientRouter;