import express from "express";
import { TaskRepository } from "../repositories/taskRepository.ts";
import { TaskService } from "../services/taskService.ts";
import { TaskController } from "../controllers/taskController.ts";
import { AuthMiddleware } from "../middlewares/authMiddleware.ts";
import { JwtService } from "../lib/jwt.ts";
import { validate } from "../middlewares/validateMiddleware.ts";
import {
    createTaskSchema,
    updateTaskSchema,
    taskIdSchema,
    taskQuerySchema,
    toggleTaskCompletionSchema
} from "../validations/taskSchema.ts";


const taskRouter = express.Router();

const repository = new TaskRepository();
const service = new TaskService(repository);
const controller = new TaskController(service);

const jwtService = new JwtService();
const authMiddleware = new AuthMiddleware(jwtService);

taskRouter.post('/', authMiddleware.authMiddleware, validate(createTaskSchema), controller.createTask);
taskRouter.get('/', authMiddleware.authMiddleware, validate(taskQuerySchema, 'query'), controller.getTasks);
taskRouter.get('/:id', authMiddleware.authMiddleware, validate(taskIdSchema, 'params'), controller.getTaskById);
taskRouter.put('/:id', authMiddleware.authMiddleware, validate(taskIdSchema, 'params'), validate(updateTaskSchema), controller.updateTask);
taskRouter.patch('/:id/toggle', authMiddleware.authMiddleware, validate(taskIdSchema, 'params'), validate(toggleTaskCompletionSchema), controller.toggleTaskCompletion);
taskRouter.delete('/:id', authMiddleware.authMiddleware, validate(taskIdSchema, 'params'), controller.deleteTask);

export default taskRouter;