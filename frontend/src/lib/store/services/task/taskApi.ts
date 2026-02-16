import type {
    CreateTaskInput,
    CreateTaskResponse,
    GetTasksResponse,
    GetTaskResponse,
    TaskQueryParams,
    UpdateTaskInput,
    UpdateTaskResponse,
    ToggleTaskCompletionInput,
    ToggleTaskCompletionResponse,
    DeleteTaskResponse,
} from "@/types/task";
import { api } from "../api";

export const taskApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getTasks: builder.query<GetTasksResponse, TaskQueryParams>({
            query: (params) => ({
                url: "/tasks",
                method: "GET",
                params: params,
            }),
            providesTags: (result) =>
                result?.data.data
                    ? [
                        ...result.data.data.map(({ id }) => ({ type: "Tasks" as const, id })),
                        { type: "Tasks", id: "LIST" },
                    ]
                    : [{ type: "Tasks", id: "LIST" }],
        }),

        createTask: builder.mutation<CreateTaskResponse, CreateTaskInput>({
            query: (data) => ({
                url: "/tasks",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Tasks"],
        }),

        updateTask: builder.mutation<UpdateTaskResponse, UpdateTaskInput>({
            query: ({ id, data }) => ({
                url: `/tasks/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (_result, _error, arg) => [
                { type: "Tasks", id: arg.id },
                "Tasks",
            ],
        }),

        toggleTaskCompletion: builder.mutation<ToggleTaskCompletionResponse, ToggleTaskCompletionInput>({
            query: ({ id, isCompleted }) => ({
                url: `/tasks/${id}/toggle`,
                method: "PATCH",
                body: { isCompleted },
            }),
            invalidatesTags: (_result, _error, arg) => [
                { type: "Tasks", id: arg.id },
                "Tasks",
            ],
        }),

        deleteTask: builder.mutation<DeleteTaskResponse, string>({
            query: (id) => ({
                url: `/tasks/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Tasks"],
        }),

        getTask: builder.query<GetTaskResponse, string>({
            query: (id) => `/tasks/${id}`,
            providesTags: (_result, _error, id) => [{ type: "Tasks", id }],
        }),
    }),
});

export const {
    useGetTasksQuery,
    useCreateTaskMutation,
    useUpdateTaskMutation,
    useToggleTaskCompletionMutation,
    useDeleteTaskMutation,
    useGetTaskQuery,
} = taskApi;