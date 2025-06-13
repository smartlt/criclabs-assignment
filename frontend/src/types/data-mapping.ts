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

export interface DataMapping {
  _id: string;
  title: string;
  description: string;
  department: Department;
  dataSubjectTypes: DataSubjectType[];
  createdAt: string;
  updatedAt: string;
}

export type SortField =
  | "title"
  | "description"
  | "department"
  | "dataSubjectTypes"
  | "createdAt"
  | "updatedAt";

export type SortDirection = "asc" | "desc";

export interface FilterState {
  title: string;
  departments: Department[];
  dataSubjectTypes: DataSubjectType[];
}

export interface QueryParams {
  title?: string;
  departments?: Department[];
  dataSubjectTypes?: DataSubjectType[];
  sortField?: SortField;
  sortDirection?: SortDirection;
  page?: number;
  limit?: number;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface DataMappingResponse {
  data: DataMapping[];
  pagination: PaginationInfo;
}

export interface UseDataMappingReturn {
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

// Form-specific types
export interface CreateDataFormData {
  title: string;
  description: string;
  department: Department | "";
  dataSubjectTypes: DataSubjectType[];
}

export interface FormErrors {
  [key: string]: string;
}
