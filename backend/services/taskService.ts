import { TaskRepository } from "../repositories/taskRepository";
import { CreateTaskSchema, UpdateTaskSchema } from "../validations/tasksValidation";
import { Prisma, Task } from "../generated/prisma/client";
import { NotFoundError, UnauthorizedError } from "../utils/appError";
import { TaskQueryResponse } from "../types/taskTypes";

export class TaskService {
    constructor(private taskRepository: TaskRepository) { }

    async createTask(userId: string, data: CreateTaskSchema): Promise<Task> {
        const createData = {
            userId,
            title: data.title,
            description: data.description ?? null,
            date: data.date ?? null,
            status: data.status ?? null,
            statusText: data.statusText ?? null,
        };

        return await this.taskRepository.create(createData);
    }

    async getTasks(
        userId: string,
        query: { page: number; limit: number; isCompleted?: string; search?: string }
    ): Promise<TaskQueryResponse> {
        const { page, limit, isCompleted, search } = query;
        const skip = (page - 1) * limit;

        const where: Prisma.TaskWhereInput = { userId };

        if (isCompleted !== undefined) {
            where.isCompleted = isCompleted === 'true';
        }

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        let orderBy: Prisma.TaskOrderByWithRelationInput = { createdAt: 'desc' };

        if (isCompleted === 'true') {
            orderBy = { updatedAt: 'desc' };
        } else if (isCompleted === 'false') {
            orderBy = { date: 'asc' };
        }

        const [{ tasks, totalCount }, allCount, completedCount, pendingCount] = await Promise.all([
            this.taskRepository.findPaginatedTasks(where, orderBy, skip, limit),
            this.taskRepository.count({ userId }),
            this.taskRepository.count({ userId, isCompleted: true }),
            this.taskRepository.count({ userId, isCompleted: false }),
        ]);

        const totalPages = Math.ceil(totalCount / limit);

        return {
            data: tasks,
            pagination: {
                currentPage: page,
                totalPages,
                totalRecords: totalCount,
                recordsPerPage: limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
            stats: {
                all: allCount,
                completed: completedCount,
                pending: pendingCount
            }
        };
    }

    async getTaskById(id: string): Promise<Task> {
        const task = await this.taskRepository.findById(id);

        if (!task) {
            throw new NotFoundError("Task not found");
        }

        return task;
    }

    async updateTask(
        id: string,
        userId: string,
        data: UpdateTaskSchema
    ): Promise<Task> {
        const existingTask = await this.taskRepository.findById(id);

        if (!existingTask) {
            throw new NotFoundError("Task not found");
        }

        if (existingTask.userId !== userId) {
            throw new UnauthorizedError("Unauthorized to update this task");
        }

        return await this.taskRepository.update(id, data);
    }

    async deleteTask(id: string, userId: string): Promise<void> {
        const existingTask = await this.taskRepository.findById(id);

        if (!existingTask) {
            throw new NotFoundError("Task not found");
        }

        if (existingTask.userId !== userId) {
            throw new UnauthorizedError("Unauthorized to delete this task");
        }

        await this.taskRepository.delete(id);
    }

    async toggleTaskCompletion(
        id: string,
        userId: string,
        isCompleted: boolean
    ): Promise<Task> {
        const existingTask = await this.taskRepository.findById(id);

        if (!existingTask) {
            throw new NotFoundError("Task not found");
        }

        if (existingTask.userId !== userId) {
            throw new UnauthorizedError("Unauthorized to update this task");
        }

        return await this.taskRepository.toggleCompletion(id, isCompleted);
    }

    async getCompletedTasks(userId: string): Promise<Task[]> {
        return await this.taskRepository.findCompletedTasks(userId);
    }

    async getPendingTasks(userId: string): Promise<Task[]> {
        return await this.taskRepository.findPendingTasks(userId);
    }
}