import { useMemo } from "react";
import { useGetPatientsQuery } from "@/lib/store/services/patient/patientApi";

import { useSearchParams } from "react-router-dom";

export function usePatients() {
  const [searchParams, setSearchParams] = useSearchParams();


  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";

  const { data, isLoading, isError, error } = useGetPatientsQuery({
    page,
    limit,
    search,
  });


  const setPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    params.set("limit", limit.toString());
    setSearchParams(params);
  };


  const patients = useMemo(() => {
    if (!data?.data?.data) return [];

    return data.data.data.map(p => ({
      id: p.id,
      name: `${p.forename} ${p.surname}`,
      diagnosis: p.diagnosis,
      status: p.status,
      lastAppointment: "N/A",
      nextAppointment: "N/A"
    }));
  }, [data]);


  if (isError) {
    throw error;
  }

  return {
    total: data?.data?.pagination?.totalRecords || 0,
    patients,
    currentPage: data?.data?.pagination?.currentPage || 1,
    totalPages: data?.data?.pagination?.totalPages || 1,
    isLoading,
    setPage
  };
}