import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDataMapping } from "@/hooks/useDataMapping";
import {
  DataMapping,
  SortField,
  SortDirection,
  FilterState,
  QueryParams,
} from "@/types/data-mapping";
import {
  SORT_DEFAULTS,
  PAGINATION_DEFAULTS,
  TABLE_HEIGHT_CLASS,
} from "@/constants/data-mapping";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EditDataForm from "./EditDataForm";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

interface DataMappingTableProps {
  filters?: FilterState;
  refreshTrigger?: number;
}

export default function DataMappingTable({
  filters,
  refreshTrigger,
}: DataMappingTableProps) {
  const {
    data,
    pagination,
    isLoading,
    error,
    fetchDataMappings,
    deleteDataMapping,
  } = useDataMapping();
  const [sortField, setSortField] = useState<SortField>(SORT_DEFAULTS.FIELD);
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    SORT_DEFAULTS.DIRECTION
  );
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [editingDataMapping, setEditingDataMapping] =
    useState<DataMapping | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Keep track of current query parameters
  const currentQueryParams = useRef<QueryParams>({});

  // Build current query parameters
  const buildQueryParams = useCallback((): QueryParams => {
    return {
      title: filters?.title,
      departments: filters?.departments,
      dataSubjectTypes: filters?.dataSubjectTypes,
      sortField,
      sortDirection,
      limit: PAGINATION_DEFAULTS.LIMIT,
    };
  }, [filters, sortField, sortDirection]);

  // Create a refresh function that uses current parameters
  const refreshTable = useCallback(() => {
    const queryParams = buildQueryParams();
    currentQueryParams.current = queryParams;
    fetchDataMappings(queryParams);
  }, [buildQueryParams, fetchDataMappings]);

  // Fetch data when filters or sorting changes
  useEffect(() => {
    refreshTable();
  }, [filters, sortField, sortDirection, refreshTable]);

  // Refresh when refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger !== undefined) {
      refreshTable();
    }
  }, [refreshTrigger, refreshTable]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const SortableHeader = ({
    field,
    children,
  }: {
    field: SortField;
    children: React.ReactNode;
  }) => (
    <th
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none sticky top-0 z-10 bg-gray-50"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        <div className="flex flex-col">
          <svg
            className={`w-3 h-3 ${
              sortField === field && sortDirection === "asc"
                ? "text-green-600"
                : "text-gray-400"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          <svg
            className={`w-3 h-3 -mt-1 ${
              sortField === field && sortDirection === "desc"
                ? "text-green-600"
                : "text-gray-400"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </th>
  );

  const handleEdit = (dataMapping: DataMapping) => {
    setEditingDataMapping(dataMapping);
    setIsEditFormOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeletingItemId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingItemId) return;

    setIsDeleting(true);
    try {
      await deleteDataMapping(deletingItemId);
      // Success feedback is handled by the hook
    } catch {
      // Error feedback is handled by the hook with toast notifications
      // Additional user feedback could be added here if needed
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setDeletingItemId(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setDeletingItemId(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-3">
          <LoadingSpinner size="lg" />
          <p className="text-sm text-gray-500">Loading data mappings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600">Error loading data mapping</div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-lg shadow ${TABLE_HEIGHT_CLASS} flex flex-col`}
    >
      {/* Pagination info */}
      {pagination && (
        <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-700">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total} results
          </p>
        </div>
      )}
      <div className="flex-1 overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <SortableHeader field="title">Title</SortableHeader>
              <SortableHeader field="description">Description</SortableHeader>
              <SortableHeader field="department">Department</SortableHeader>
              <SortableHeader field="dataSubjectTypes">
                Data Subject Types
              </SortableHeader>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-10 bg-gray-50">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data && data.length > 0 ? (
              data.map((item: DataMapping) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-md">
                    {item.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.department}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="flex flex-wrap gap-2">
                      {item.dataSubjectTypes.map((type) => (
                        <span
                          key={type}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      className="text-green-600 hover:text-green-900 mr-4"
                      onClick={() => handleEdit(item)}
                    >
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDeleteClick(item._id)}
                    >
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <svg
                      className="w-12 h-12 text-gray-400 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No data mappings found
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Get started by creating your first data mapping.
                    </p>
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <svg
                        className="-ml-1 mr-2 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Create Data Mapping
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Data Form */}
      <EditDataForm
        isOpen={isEditFormOpen}
        onClose={() => {
          setIsEditFormOpen(false);
          setEditingDataMapping(null);
        }}
        onSuccess={() => {
          refreshTable();
          setIsEditFormOpen(false);
          setEditingDataMapping(null);
        }}
        dataMapping={editingDataMapping}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Delete Data Mapping"
        message="Are you sure you want to delete this data mapping? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isLoading={isDeleting}
      />
    </div>
  );
}
