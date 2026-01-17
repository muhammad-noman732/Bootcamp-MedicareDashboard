import express from "express";
import { TaskRepository } from "../repositories/taskRepository.ts";
import { TaskService } from "../services/taskService.ts";
import { TaskController } from "../controllers/taskController.ts";
import { AuthMiddleware } from "../middlewares/authMiddleware.ts";
import { JwtService } from "../lib/jwt.ts";

const taskRouter = express.Router();

const repository = new TaskRepository();
const service = new TaskService(repository);
const controller = new TaskController(service);

const jwtService = new JwtService();
const authMiddleware = new AuthMiddleware(jwtService);

taskRouter.post('/', authMiddleware.authMiddleware, controller.createTask);
taskRouter.get('/', authMiddleware.authMiddleware, controller.getTasks);
taskRouter.get('/:id', authMiddleware.authMiddleware, controller.getTaskById);
taskRouter.put('/:id', authMiddleware.authMiddleware, controller.updateTask);
taskRouter.patch('/:id/toggle', authMiddleware.authMiddleware, controller.toggleTaskCompletion);
taskRouter.delete('/:id', authMiddleware.authMiddleware, controller.deleteTask);

export default taskRouter;
