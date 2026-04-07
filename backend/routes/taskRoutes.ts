import express from "express";
import { TaskRepository } from "../repositories/taskRepository";
import { TaskService } from "../services/taskService";
import { TaskController } from "../controllers/taskController";
import { AuthMiddleware } from "../middlewares/authMiddleware";
import { JwtService } from "../lib/jwt";
import { validate } from "../middlewares/validateMiddleware";
import {
    createTaskSchema,
    updateTaskSchema,
    taskIdSchema,
    taskQuerySchema,
    toggleTaskCompletionSchema
} from "../validations/tasksValidation";


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
