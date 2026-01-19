import type {
    CreatePatientInput,
    CreatePatientResponse,
    GetPatientsResponse,
    GetPatientResponse,
    PatientQueryParams,
    UpdatePatientInput,
    UpdatePatientResponse,
    DeletePatientResponse
} from "@/types/patient";
import { api } from "../api";

export const patientApi = api.injectEndpoints({
    endpoints: (builder) => ({
        addPatient: builder.mutation<CreatePatientResponse, CreatePatientInput>({
            query: (data) => ({
                url: "/patients",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Patients"],
        }),


        updatePatient: builder.mutation<UpdatePatientResponse, UpdatePatientInput>({
            query: ({ id, data }) => ({
                url: `/patients/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (_result, _error, arg) => [
                { type: "Patients", id: arg.id },
                "Patients"
            ],
        }),

        deletePatient: builder.mutation<DeletePatientResponse, string>({
            query: (id) => ({
                url: `/patients/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Patients"],
        }),

        getPatients: builder.query<GetPatientsResponse, PatientQueryParams>({
            query: (params) => ({
                url: "/patients",
                method: "GET",
                params: params
            }),
            providesTags: (result) =>
                result?.data.data
                    ? [
                        ...result.data.data.map(({ id }) =>
                            ({ type: "Patients" as const, id })),
                        { type: "Patients", id: "LIST" },
                    ]
                    : [{ type: "Patients", id: "LIST" }],
        }),

        getPatient: builder.query<GetPatientResponse, string>({
            query: (id) => `/patients/${id}`,
            providesTags: (_result, _error, id) => [{ type: "Patients", id }],
        }),
    }),
});

export const {
    useAddPatientMutation,
    useUpdatePatientMutation,
    useDeletePatientMutation,
    useGetPatientsQuery,
    useGetPatientQuery
} = patientApi;
