import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";

export enum Department {
  HUMAN_RESOURCES = "Human Resources",
  IT_IS = "IT/IS",
  ADMISSION = "Admission",
  MARKETING = "Marketing",
}

export enum DataSubjectType {
  EMPLOYEES = "Employees",
  FACULTY_STAFF = "Faculty Staff",
  STUDENTS = "Students",
}

interface DataMapping {
  _id: string;
  title: string;
  description: string;
  department: Department;
  dataSubjectTypes: DataSubjectType[];
  createdAt: string;
  updatedAt: string;
}

interface QueryParams {
  title?: string;
  departments?: Department[];
  dataSubjectTypes?: DataSubjectType[];
  sortField?: string;
  sortDirection?: "asc" | "desc";
  page?: number;
  limit?: number;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface DataMappingResponse {
  data: DataMapping[];
  pagination: PaginationInfo;
}

interface UseDataMappingReturn {
  data: DataMapping[] | null;
  pagination: PaginationInfo | null;
  isLoading: boolean;
  error: Error | null;
  fetchDataMappings: (params?: QueryParams) => Promise<void>;
  createDataMapping: (
    data: Omit<DataMapping, "_id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  updateDataMapping: (
    id: string,
    data: Partial<Omit<DataMapping, "_id" | "createdAt" | "updatedAt">>
  ) => Promise<void>;
  deleteDataMapping: (id: string) => Promise<void>;
}

export function useDataMapping(): UseDataMappingReturn {
  const [data, setData] = useState<DataMapping[] | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentParams, setCurrentParams] = useState<QueryParams | undefined>(
    undefined
  );

  const fetchDataMappings = useCallback(async (params?: QueryParams) => {
    try {
      setIsLoading(true);

      // Store current parameters for future use
      setCurrentParams(params);

      // Build query string from parameters
      const queryString = new URLSearchParams();
      if (params?.title) queryString.append("title", params.title);
      if (params?.departments?.length) {
        params.departments.forEach((dept) =>
          queryString.append("departments", dept)
        );
      }
      if (params?.dataSubjectTypes?.length) {
        params.dataSubjectTypes.forEach((type) =>
          queryString.append("dataSubjectTypes", type)
        );
      }
      if (params?.sortField) queryString.append("sortField", params.sortField);
      if (params?.sortDirection)
        queryString.append("sortDirection", params.sortDirection);
      if (params?.page) queryString.append("page", params.page.toString());
      if (params?.limit) queryString.append("limit", params.limit.toString());

      const url = `/data-records${
        queryString.toString() ? `?${queryString.toString()}` : ""
      }`;
      const response = await api.get<DataMappingResponse>(url);

      setData(response.data.data);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch data mappings")
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createDataMapping = async (
    newData: Omit<DataMapping, "_id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const response = await api.post("/data-records", newData);
      if (response.status !== 201) {
        throw new Error("Failed to create data mapping");
      }
      await fetchDataMappings(currentParams);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to create data mapping")
      );
      throw err;
    }
  };

  const updateDataMapping = async (
    id: string,
    updateData: Partial<Omit<DataMapping, "_id" | "createdAt" | "updatedAt">>
  ) => {
    try {
      const response = await api.patch(`/data-records/${id}`, updateData);
      if (!response.data) {
        throw new Error("Failed to update data mapping");
      }
      await fetchDataMappings(currentParams);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to update data mapping")
      );
      throw err;
    }
  };

  const deleteDataMapping = async (id: string) => {
    try {
      const response = await api.delete(`/data-records/${id}`);
      if (response.status !== 200) {
        throw new Error("Failed to delete data mapping");
      }
      await fetchDataMappings(currentParams);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to delete data mapping")
      );
      throw err;
    }
  };

  useEffect(() => {
    fetchDataMappings();
  }, [fetchDataMappings]);

  return {
    data,
    pagination,
    isLoading,
    error,
    fetchDataMappings,
    createDataMapping,
    updateDataMapping,
    deleteDataMapping,
  };
}
