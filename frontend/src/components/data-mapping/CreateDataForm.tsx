import React, { useState, useCallback } from "react";
import { useDataMapping } from "@/hooks/useDataMapping";
import {
  Department,
  DataSubjectType,
  CreateDataFormData,
  FormErrors,
} from "@/types/data-mapping";
import {
  DEPARTMENT_OPTIONS,
  DATA_SUBJECT_TYPE_OPTIONS,
  VALIDATION_MESSAGES,
} from "@/constants/data-mapping";
import SlideOutPanel from "@/components/ui/SlideOutPanel";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface CreateDataFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateDataForm({
  isOpen,
  onClose,
  onSuccess,
}: CreateDataFormProps) {
  const { createDataMapping } = useDataMapping();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState<CreateDataFormData>({
    title: "",
    description: "",
    department: "",
    dataSubjectTypes: [],
  });

  const validateField = useCallback(
    (field: keyof CreateDataFormData, value: string) => {
      switch (field) {
        case "title":
          return !value.trim() ? VALIDATION_MESSAGES.TITLE_REQUIRED : "";
        case "department":
          return !value ? VALIDATION_MESSAGES.DEPARTMENT_REQUIRED : "";
        default:
          return "";
      }
    },
    []
  );

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = VALIDATION_MESSAGES.TITLE_REQUIRED;
    }

    if (!formData.department) {
      newErrors.department = VALIDATION_MESSAGES.DEPARTMENT_REQUIRED;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await createDataMapping({
        title: formData.title.trim(),
        description: formData.description.trim(),
        department: formData.department as Department,
        dataSubjectTypes: formData.dataSubjectTypes,
      });

      // Reset form and close
      setFormData({
        title: "",
        description: "",
        department: "",
        dataSubjectTypes: [],
      });
      setErrors({});

      // Call onSuccess if provided, otherwise just close
      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
      }
    } catch {
      // Error is already handled by the hook with toast notifications
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDataSubjectTypeChange = (type: DataSubjectType) => {
    setFormData((prev) => ({
      ...prev,
      dataSubjectTypes: prev.dataSubjectTypes.includes(type)
        ? prev.dataSubjectTypes.filter((t) => t !== type)
        : [...prev.dataSubjectTypes, type],
    }));
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        title: "",
        description: "",
        department: "",
        dataSubjectTypes: [],
      });
      setErrors({});
      onClose();
    }
  };

  const actions = (
    <>
      <button
        type="button"
        onClick={handleClose}
        disabled={isSubmitting}
        className="px-4 py-2 text-sm font-medium text-black bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
      >
        Cancel
      </button>
      <button
        type="submit"
        form="create-data-form"
        disabled={isSubmitting}
        className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <LoadingSpinner size="sm" variant="white" className="mr-2" />
            Saving...
          </>
        ) : (
          "Save"
        )}
      </button>
    </>
  );

  return (
    <SlideOutPanel
      isOpen={isOpen}
      onClose={handleClose}
      title="New Data"
      actions={actions}
    >
      <form id="create-data-form" onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-black mb-2"
          >
            Title *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => {
              const value = e.target.value;
              setFormData((prev) => ({ ...prev, title: value }));

              // Real-time validation
              const error = validateField("title", value);
              setErrors((prev) => ({ ...prev, title: error }));
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
            placeholder="Enter title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-black mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
            placeholder="Enter description"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        {/* Department */}
        <div>
          <label
            htmlFor="department"
            className="block text-sm font-medium text-black mb-2"
          >
            Department *
          </label>
          <select
            id="department"
            value={formData.department}
            onChange={(e) => {
              const value = e.target.value as Department;
              setFormData((prev) => ({ ...prev, department: value }));

              // Real-time validation
              const error = validateField("department", value);
              setErrors((prev) => ({ ...prev, department: error }));
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
          >
            <option value="">Select Department</option>
            {DEPARTMENT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.department && (
            <p className="mt-1 text-sm text-red-600">{errors.department}</p>
          )}
        </div>

        {/* Data Subject Types */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Data Subject Type (Optional)
          </label>
          <div className="space-y-2">
            {DATA_SUBJECT_TYPE_OPTIONS.map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.dataSubjectTypes.includes(option.value)}
                  onChange={() => handleDataSubjectTypeChange(option.value)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-black">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      </form>
    </SlideOutPanel>
  );
}
