import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import {
  Department,
  DataSubjectType,
  DataMapping,
  QueryParams,
  PaginationInfo,
  DataMappingResponse,
  UseDataMappingReturn,
} from "@/types/data-mapping";

// Re-export enums for backward compatibility
export { Department, DataSubjectType };
import { ERROR_MESSAGES } from "@/constants/data-mapping";

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
        err instanceof Error ? err : new Error(ERROR_MESSAGES.FETCH_FAILED)
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
      // Don't auto-refresh here - let the component handle it
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error(ERROR_MESSAGES.CREATE_FAILED)
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
        err instanceof Error ? err : new Error(ERROR_MESSAGES.UPDATE_FAILED)
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
        err instanceof Error ? err : new Error(ERROR_MESSAGES.DELETE_FAILED)
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
