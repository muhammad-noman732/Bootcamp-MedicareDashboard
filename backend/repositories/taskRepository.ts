import { Task, Prisma } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";
import type { CreateTaskData, UpdateTaskData } from "../types/taskTypes";

export class TaskRepository {

    async create(data: CreateTaskData): Promise<Task> {
        return await prisma.task.create({
            data,
        });
    }

    async findByUserId(userId: string): Promise<Task[]> {
        return await prisma.task.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
    }

    async findById(id: string): Promise<Task | null> {
        return await prisma.task.findUnique({
            where: { id },
        });
    }

    async update(id: string, data: UpdateTaskData): Promise<Task> {
        return await prisma.task.update({
            where: { id },
            data,
        });
    }

    async delete(id: string): Promise<Task> {
        return await prisma.task.delete({
            where: { id },
        });
    }

    async toggleCompletion(id: string, isCompleted: boolean): Promise<Task> {
        return await prisma.task.update({
            where: { id },
            data: {
                isCompleted,
                updatedAt: new Date(),
            },
        });
    }

    async findPaginatedTasks(
        where: Prisma.TaskWhereInput,
        orderBy: Prisma.TaskOrderByWithRelationInput,
        skip: number,
        take: number
    ): Promise<{ tasks: Task[]; totalCount: number }> {
        const [tasks, totalCount] = await Promise.all([
            prisma.task.findMany({
                where,
                orderBy,
                skip,
                take,
            }),
            prisma.task.count({
                where,
            }),
        ]);

        return {
            tasks,
            totalCount,
        };
    }

    async count(where: Prisma.TaskWhereInput): Promise<number> {
        return await prisma.task.count({
            where,
        });
    }

    async findCompletedTasks(userId: string): Promise<Task[]> {
        return await prisma.task.findMany({
            where: {
                userId,
                isCompleted: true,
            },
            orderBy: { updatedAt: "desc" },
        });
    }

    async findPendingTasks(userId: string): Promise<Task[]> {
        return await prisma.task.findMany({
            where: {
                userId,
                isCompleted: false,
            },
            orderBy: { date: "asc" },
        });
    }

    async getRecentTasks(userId: string, limit: number = 4): Promise<Task[]> {
        return await prisma.task.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: limit
        });
    }
}
