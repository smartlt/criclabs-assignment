import React, { useState } from "react";
import {
  useDataMapping,
  Department,
  DataSubjectType,
} from "@/hooks/useDataMapping";

interface CreateDataFormMobileProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  title: string;
  description: string;
  department: Department | "";
  dataSubjectTypes: DataSubjectType[];
}

const departmentOptions = [
  { value: Department.HUMAN_RESOURCES, label: "Human Resources" },
  { value: Department.IT_IS, label: "IT/IS" },
  { value: Department.ADMISSION, label: "Admission" },
  { value: Department.MARKETING, label: "Marketing" },
];

const dataSubjectTypeOptions = [
  { value: DataSubjectType.EMPLOYEES, label: "Employees" },
  { value: DataSubjectType.FACULTY_STAFF, label: "Faculty Staff" },
  { value: DataSubjectType.STUDENTS, label: "Students" },
];

export default function CreateDataFormMobile({
  isOpen,
  onClose,
}: CreateDataFormMobileProps) {
  const { createDataMapping } = useDataMapping();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    department: "",
    dataSubjectTypes: [],
  });

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.department) {
      newErrors.department = "Department is required";
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
      onClose();
    } catch (error) {
      console.error("Failed to create data mapping:", error);
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

  if (!isOpen) return null;

  return (
    <div className="">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 z-40" onClick={handleClose} />

      {/* Mobile Form */}
      <div className="fixed inset-0 bg-white z-50 flex flex-col mt-16 rounded-t-lg shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white rounded-t-lg">
          <div className="flex items-center">
            <h2 className="text-lg font-semibold text-gray-900">New Data</h2>
          </div>
          <button
            type="submit"
            form="create-data-form-mobile"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-4">
          <form
            id="create-data-form-mobile"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Title */}
            <div>
              <label
                htmlFor="title-mobile"
                className="block text-sm font-medium text-black mb-2"
              >
                Title *
              </label>
              <input
                type="text"
                id="title-mobile"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full px-3 py-3 border border-gray-300 rounded-md text-black text-base"
                placeholder="Enter title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description-mobile"
                className="block text-sm font-medium text-black mb-2"
              >
                Description
              </label>
              <textarea
                id="description-mobile"
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full px-3 py-3 border border-gray-300 rounded-md text-black text-base"
                placeholder="Enter description"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Department */}
            <div>
              <label
                htmlFor="department-mobile"
                className="block text-sm font-medium text-black mb-2"
              >
                Department *
              </label>
              <select
                id="department-mobile"
                value={formData.department}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    department: e.target.value as Department,
                  }))
                }
                className="w-full px-3 py-3 border border-gray-300 rounded-md text-black text-base"
              >
                <option value="">Select Department</option>
                {departmentOptions.map((option) => (
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
              <label className="block text-sm font-medium text-black mb-3">
                Data Subject Type (Optional)
              </label>
              <div className="space-y-3">
                {dataSubjectTypeOptions.map((option) => (
                  <label key={option.value} className="flex items-center py-2">
                    <input
                      type="checkbox"
                      checked={formData.dataSubjectTypes.includes(option.value)}
                      onChange={() => handleDataSubjectTypeChange(option.value)}
                      className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-base text-black">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
