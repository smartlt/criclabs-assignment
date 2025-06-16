import { AxiosError } from "axios";
import { ERROR_MESSAGES } from "@/constants/data-mapping";

export interface ErrorInfo {
  title: string;
  message?: string;
  shouldRetry?: boolean;
  shouldRedirect?: boolean;
}

export function handleApiError(error: unknown): ErrorInfo {
  // Handle Axios errors
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    switch (status) {
      case 400:
        return {
          title: "Invalid Request",
          message: message || "Please check your input and try again.",
          shouldRetry: false,
        };

      case 401:
        return {
          title: "Authentication Required",
          message: ERROR_MESSAGES.UNAUTHORIZED,
          shouldRetry: false,
          shouldRedirect: true,
        };

      case 403:
        return {
          title: "Access Denied",
          message: ERROR_MESSAGES.FORBIDDEN,
          shouldRetry: false,
        };

      case 404:
        return {
          title: "Not Found",
          message: ERROR_MESSAGES.NOT_FOUND,
          shouldRetry: false,
        };

      case 409:
        return {
          title: "Conflict",
          message:
            message ||
            "This resource already exists or conflicts with existing data.",
          shouldRetry: false,
        };

      case 422:
        return {
          title: "Validation Error",
          message: message || "Please check your input and try again.",
          shouldRetry: false,
        };

      case 429:
        return {
          title: "Too Many Requests",
          message: "Please wait a moment before trying again.",
          shouldRetry: true,
        };

      case 500:
      case 502:
      case 503:
      case 504:
        return {
          title: "Server Error",
          message: ERROR_MESSAGES.SERVER_ERROR,
          shouldRetry: true,
        };

      default:
        if (error.code === "NETWORK_ERROR" || error.code === "ERR_NETWORK") {
          return {
            title: "Network Error",
            message: ERROR_MESSAGES.NETWORK_ERROR,
            shouldRetry: true,
          };
        }

        return {
          title: "Request Failed",
          message: message || ERROR_MESSAGES.GENERIC_ERROR,
          shouldRetry: true,
        };
    }
  }

  // Handle standard JavaScript errors
  if (error instanceof Error) {
    return {
      title: "Error",
      message: error.message || ERROR_MESSAGES.GENERIC_ERROR,
      shouldRetry: false,
    };
  }

  // Handle unknown errors
  return {
    title: "Unknown Error",
    message: ERROR_MESSAGES.GENERIC_ERROR,
    shouldRetry: false,
  };
}

export function getOperationErrorMessage(
  operation: string,
  error: unknown
): ErrorInfo {
  const baseError = handleApiError(error);

  const operationTitles: Record<string, string> = {
    fetch: "Failed to Load Data",
    create: "Failed to Create",
    update: "Failed to Update",
    delete: "Failed to Delete",
    save: "Failed to Save",
  };

  return {
    ...baseError,
    title: operationTitles[operation] || baseError.title,
  };
}
