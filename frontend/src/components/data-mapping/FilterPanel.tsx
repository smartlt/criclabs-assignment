import React, { useState } from "react";
import SlideOutPanel from "@/components/ui/SlideOutPanel";
import { Department, DataSubjectType, FilterState } from "@/types/data-mapping";
import {
  DEPARTMENT_OPTIONS,
  DATA_SUBJECT_TYPE_OPTIONS,
} from "@/constants/data-mapping";

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilter: (filters: FilterState) => void;
  onResetFilter: () => void;
}

// Re-export FilterState for backward compatibility
export type { FilterState };

export default function FilterPanel({
  isOpen,
  onClose,
  onApplyFilter,
  onResetFilter,
}: FilterPanelProps) {
  const [filters, setFilters] = useState<FilterState>({
    title: "",
    departments: [],
    dataSubjectTypes: [],
  });

  const handleDepartmentChange = (department: Department) => {
    setFilters((prev) => ({
      ...prev,
      departments: prev.departments.includes(department)
        ? prev.departments.filter((d) => d !== department)
        : [...prev.departments, department],
    }));
  };

  const handleDataSubjectTypeChange = (type: DataSubjectType) => {
    setFilters((prev) => ({
      ...prev,
      dataSubjectTypes: prev.dataSubjectTypes.includes(type)
        ? prev.dataSubjectTypes.filter((t) => t !== type)
        : [...prev.dataSubjectTypes, type],
    }));
  };

  const handleApplyFilter = () => {
    onApplyFilter(filters);
    onClose();
  };

  const handleResetFilter = () => {
    setFilters({
      title: "",
      departments: [],
      dataSubjectTypes: [],
    });
    onResetFilter();
    onClose();
  };

  const actions = (
    <>
      <button
        type="button"
        onClick={handleResetFilter}
        className="px-4 py-2 text-sm font-medium text-black bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        Reset
      </button>
      <button
        type="button"
        onClick={handleApplyFilter}
        className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        Apply Filter
      </button>
    </>
  );

  return (
    <SlideOutPanel
      isOpen={isOpen}
      onClose={onClose}
      title="Filter"
      actions={actions}
    >
      <div className="space-y-6">
        {/* Search Filter */}
        <div>
          <label
            htmlFor="title-search"
            className="block text-sm font-medium text-black mb-2"
          >
            Search filter
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              id="title-search"
              value={filters.title}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Search filter"
            />
          </div>
        </div>

        {/* Department Filter */}
        <div>
          <label className="block text-sm font-medium text-black mb-3">
            DEPARTMENT
          </label>
          <div className="space-y-3">
            {DEPARTMENT_OPTIONS.map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.departments.includes(option.value)}
                  onChange={() => handleDepartmentChange(option.value)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-black">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Data Subject Type Filter */}
        <div>
          <label className="block text-sm font-medium text-black mb-3">
            DATA SUBJECT
          </label>
          <div className="space-y-3">
            {DATA_SUBJECT_TYPE_OPTIONS.map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.dataSubjectTypes.includes(option.value)}
                  onChange={() => handleDataSubjectTypeChange(option.value)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-black">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </SlideOutPanel>
  );
}
