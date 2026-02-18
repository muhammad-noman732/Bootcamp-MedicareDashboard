import z from "zod";

export const createTaskSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long"),
    description: z.string().optional(),
    date: z.coerce.date().optional(),
    status: z.boolean().optional(),
    statusText: z.string().optional(),
});

export const updateTaskSchema = createTaskSchema.partial();

export const taskIdSchema = z.object({
    id: z.string().min(1, "Task ID is required")
});

export const toggleTaskCompletionSchema = z.object({
    isCompleted: z.boolean()
});

export const taskQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    isCompleted: z.enum(['true', 'false']).optional(),
    search: z.string().optional(),
});

export type CreateTaskSchema = z.infer<typeof createTaskSchema>;
export type UpdateTaskSchema = z.infer<typeof updateTaskSchema>;
export type TaskIdSchema = z.infer<typeof taskIdSchema>;
export type ToggleTaskCompletionSchema = z.infer<typeof toggleTaskCompletionSchema>;
export type TaskQuerySchema = z.infer<typeof taskQuerySchema>;