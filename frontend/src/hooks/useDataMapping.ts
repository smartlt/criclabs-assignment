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
import { SUCCESS_MESSAGES } from "@/constants/data-mapping";
import { useToast } from "@/contexts/ToastContext";
import { getOperationErrorMessage } from "@/utils/error-handler";

// Re-export enums for backward compatibility
export { Department, DataSubjectType };

export function useDataMapping(): UseDataMappingReturn {
  const [data, setData] = useState<DataMapping[] | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentParams, setCurrentParams] = useState<QueryParams | undefined>(
    undefined
  );

  const { showSuccess, showError } = useToast();

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
      const errorInfo = getOperationErrorMessage("fetch", err);
      const error = new Error(errorInfo.message || errorInfo.title);
      setError(error);
      showError(errorInfo.title, errorInfo.message);
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
      showSuccess(SUCCESS_MESSAGES.CREATE_SUCCESS);
      // Don't auto-refresh here - let the component handle it
    } catch (err) {
      const errorInfo = getOperationErrorMessage("create", err);
      const error = new Error(errorInfo.message || errorInfo.title);
      setError(error);
      showError(errorInfo.title, errorInfo.message);
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
      showSuccess(SUCCESS_MESSAGES.UPDATE_SUCCESS);
      await fetchDataMappings(currentParams);
    } catch (err) {
      const errorInfo = getOperationErrorMessage("update", err);
      const error = new Error(errorInfo.message || errorInfo.title);
      setError(error);
      showError(errorInfo.title, errorInfo.message);
      throw err;
    }
  };

  const deleteDataMapping = async (id: string) => {
    try {
      const response = await api.delete(`/data-records/${id}`);
      if (response.status !== 200) {
        throw new Error("Failed to delete data mapping");
      }
      showSuccess(SUCCESS_MESSAGES.DELETE_SUCCESS);
      await fetchDataMappings(currentParams);
    } catch (err) {
      const errorInfo = getOperationErrorMessage("delete", err);
      const error = new Error(errorInfo.message || errorInfo.title);
      setError(error);
      showError(errorInfo.title, errorInfo.message);
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
