import { useState, useEffect } from "react";
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

interface UseDataMappingReturn {
  data: DataMapping[] | null;
  isLoading: boolean;
  error: Error | null;
  createDataMapping: (
    data: Omit<DataMapping, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  updateDataMapping: (
    id: string,
    data: Partial<Omit<DataMapping, "id" | "createdAt" | "updatedAt">>
  ) => Promise<void>;
  deleteDataMapping: (id: string) => Promise<void>;
}

export function useDataMapping(): UseDataMappingReturn {
  const [data, setData] = useState<DataMapping[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDataMappings = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/data-records");
      setData(response.data);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch data mappings")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const createDataMapping = async (
    newData: Omit<DataMapping, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const response = await api.post("/data-records", newData);
      if (response.status !== 201) {
        throw new Error("Failed to create data mapping");
      }
      await fetchDataMappings();
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to create data mapping")
      );
      throw err;
    }
  };

  const updateDataMapping = async (
    id: string,
    updateData: Partial<Omit<DataMapping, "id" | "createdAt" | "updatedAt">>
  ) => {
    try {
      const response = await api.patch(`/data-records/${id}`, updateData);
      if (!response.data) {
        throw new Error("Failed to update data mapping");
      }
      await fetchDataMappings();
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
      await fetchDataMappings();
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to delete data mapping")
      );
      throw err;
    }
  };

  useEffect(() => {
    fetchDataMappings();
  }, []);

  return {
    data,
    isLoading,
    error,
    createDataMapping,
    updateDataMapping,
    deleteDataMapping,
  };
}
