import { asyncHandler } from "../utils/asyncHandler";
import type { Request, Response } from "express";
import { TaskService } from "../services/taskService";
import { createTaskSchema, updateTaskSchema, taskIdSchema, toggleTaskCompletionSchema, taskQuerySchema } from "../validations/tasksValidation";
import { InternalServerError, UnauthorizedError } from '../utils/appError';

export class TaskController {

    constructor(
        private taskService: TaskService
    ) { }

    createTask = asyncHandler(async (req: Request, res: Response) => {
        const data = createTaskSchema.parse(req.body);
        const userId = req.user.id;

        if (!userId) {
            throw new UnauthorizedError("Unauthorized to create task");
        }

        const task = await this.taskService.createTask(userId, data);

        res.status(201).json({
            status: "success",
            message: "Task created successfully",
            data: task
        });
    });

    getTasks = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user.id;
        const query = taskQuerySchema.parse(req.query);

        if (!userId) {
            throw new UnauthorizedError("Unauthorized to get tasks");
        }

        const result = await this.taskService.getTasks(userId, query);

        res.status(200).json({
            message: "Tasks retrieved successfully",
            data: result,
        });
    });

    getTaskById = asyncHandler(async (req: Request, res: Response) => {
        const { id } = taskIdSchema.parse(req.params);

        const task = await this.taskService.getTaskById(id);

        if (!task) {
            throw new InternalServerError("Task not found");
        }

        res.status(200).json({
            status: "success",
            data: task
        });
    });

    updateTask = asyncHandler(async (req: Request, res: Response) => {
        const { id } = taskIdSchema.parse(req.params);
        const userId = req.user.id;

        if (!userId) {
            throw new UnauthorizedError("Unauthorized to update task");
        }

        const updateData = updateTaskSchema.parse(req.body);

        const updatedTask = await this.taskService.updateTask(id, userId, updateData);

        res.status(200).json({
            status: "success",
            message: "Task updated successfully",
            data: updatedTask
        });
    });

    deleteTask = asyncHandler(async (req: Request, res: Response) => {
        const { id } = taskIdSchema.parse(req.params);
        const userId = req.user.id;

        if (!userId) {
            throw new UnauthorizedError("Unauthorized to delete task");
        }

        await this.taskService.deleteTask(id, userId);

        res.status(200).json({
            status: "success",
            message: "Task deleted successfully"
        });
    });

    toggleTaskCompletion = asyncHandler(async (req: Request, res: Response) => {
        const { id } = taskIdSchema.parse(req.params);
        const userId = req.user.id;
        const { isCompleted } = toggleTaskCompletionSchema.parse(req.body);

        if (!userId) {
            throw new UnauthorizedError("Unauthorized to update task");
        }

        const updatedTask = await this.taskService.toggleTaskCompletion(id, userId, isCompleted);

        res.status(200).json({
            status: "success",
            message: `Task marked as ${isCompleted ? 'completed' : 'pending'}`,
            data: updatedTask
        });
    });
}