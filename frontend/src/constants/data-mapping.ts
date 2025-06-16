import { Department, DataSubjectType } from "@/types/data-mapping";

// Pagination constants
export const PAGINATION_DEFAULTS = {
  LIMIT: 50,
  MAX_LIMIT: 100,
  PAGE: 1,
} as const;

// Sorting constants
export const SORT_DEFAULTS = {
  FIELD: "createdAt" as const,
  DIRECTION: "desc" as const,
} as const;

// UI constants
export const TABLE_HEIGHT_CLASS = "h-130";

// Department options for dropdowns and filters
export const DEPARTMENT_OPTIONS = [
  { value: Department.HUMAN_RESOURCES, label: "Human Resources" },
  { value: Department.IT_IS, label: "IT/IS" },
  { value: Department.ADMISSION, label: "Admission" },
  { value: Department.MARKETING, label: "Marketing" },
] as const;

// Data subject type options for dropdowns and filters
export const DATA_SUBJECT_TYPE_OPTIONS = [
  { value: DataSubjectType.EMPLOYEES, label: "Employees" },
  { value: DataSubjectType.FACULTY_STAFF, label: "Faculty Staff" },
  { value: DataSubjectType.STUDENTS, label: "Students" },
] as const;

// Form validation messages
export const VALIDATION_MESSAGES = {
  TITLE_REQUIRED: "Title is required",
  DEPARTMENT_REQUIRED: "Department is required",
  DESCRIPTION_REQUIRED: "Description is required",
} as const;

// API error messages
export const ERROR_MESSAGES = {
  FETCH_FAILED: "Failed to fetch data mappings",
  CREATE_FAILED: "Failed to create data mapping",
  UPDATE_FAILED: "Failed to update data mapping",
  DELETE_FAILED: "Failed to delete data mapping",
  DELETE_CONFIRM: "Are you sure you want to delete this data mapping?",
  GENERIC_ERROR: "An error occurred. Please try again.",
  NETWORK_ERROR: "Network error. Please check your connection and try again.",
  UNAUTHORIZED: "Your session has expired. Please log in again.",
  FORBIDDEN: "You don't have permission to perform this action.",
  NOT_FOUND: "The requested resource was not found.",
  SERVER_ERROR: "Server error. Please try again later.",
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  CREATE_SUCCESS: "Data mapping created successfully",
  UPDATE_SUCCESS: "Data mapping updated successfully",
  DELETE_SUCCESS: "Data mapping deleted successfully",
  SAVE_SUCCESS: "Changes saved successfully",
  COPY_SUCCESS: "Copied to clipboard",
} as const;

// Loading messages
export const LOADING_MESSAGES = {
  FETCHING: "Loading data mappings...",
  CREATING: "Creating data mapping...",
  UPDATING: "Updating data mapping...",
  DELETING: "Deleting data mapping...",
  SAVING: "Saving changes...",
} as const;
