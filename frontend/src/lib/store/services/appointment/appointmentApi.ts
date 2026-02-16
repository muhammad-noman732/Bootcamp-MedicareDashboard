import type {
    CreateAppointmentInput,
    CreateAppointmentResponse,
    GetAppointmentsResponse,
    GetAppointmentResponse,
    UpdateAppointmentInput,
    UpdateAppointmentResponse,
    DeleteAppointmentResponse,
    DateRangeQueryParams,
} from "@/types/appointment";
import { api } from "../api";

export const appointmentApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAppointments: builder.query<GetAppointmentsResponse, void>({
            query: () => ({
                url: "/appointments",
                method: "GET",
            }),
            providesTags: (result) =>
                result?.data
                    ? [
                        ...result.data.map(({ id }) => ({ type: "Appointments" as const, id })),
                        { type: "Appointments", id: "LIST" },
                    ]
                    : [{ type: "Appointments", id: "LIST" }],
        }),

        getAppointment: builder.query<GetAppointmentResponse, string>({
            query: (id) => `/appointments/${id}`,
            providesTags: (_result, _error, id) => [{ type: "Appointments", id }],
        }),

        createAppointment: builder.mutation<CreateAppointmentResponse, CreateAppointmentInput>({
            query: (data) => ({
                url: "/appointments",
                method: "POST",
                body: data,
            }),
            invalidatesTags: (error) =>
                error ? [] : [{ type: "Appointments", id: "LIST" }],
        }),

        updateAppointment: builder.mutation<UpdateAppointmentResponse, UpdateAppointmentInput>({
            query: ({ id, data }) => ({
                url: `/appointments/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (_result, _error, arg) => [
                { type: "Appointments", id: arg.id },
                "Appointments",
            ],
        }),

        deleteAppointment: builder.mutation<DeleteAppointmentResponse, string>({
            query: (id) => ({
                url: `/appointments/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Appointments"],
        }),

        getAppointmentsByDateRange: builder.query<GetAppointmentsResponse, DateRangeQueryParams>({
            query: (params) => ({
                url: "/appointments/range",
                method: "GET",
                params: params,
            }),
            providesTags: ["Appointments"],
        }),
    }),
});

export const {
    useGetAppointmentsQuery,
    useGetAppointmentQuery,
    useCreateAppointmentMutation,
    useUpdateAppointmentMutation,
    useDeleteAppointmentMutation,
    useGetAppointmentsByDateRangeQuery,
} = appointmentApi;