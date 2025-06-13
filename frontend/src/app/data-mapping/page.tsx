"use client";

import React, { useState } from "react";
import Navigation from "@/components/layout/Navigation";
import TopBar from "@/components/layout/TopBar";
import DataMappingTable from "@/components/data-mapping/DataMappingTable";
import CreateDataForm from "@/components/data-mapping/CreateDataForm";
import FilterPanel, {
  FilterState,
} from "@/components/data-mapping/FilterPanel";

export default function DataMappingPage() {
  const [activeTab, setActiveTab] = useState("data-mapping");
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [filters, setFilters] = useState<FilterState>({
    title: "",
    departments: [],
    dataSubjectTypes: [],
  });

  const handleApplyFilter = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleResetFilter = () => {
    setFilters({
      title: "",
      departments: [],
      dataSubjectTypes: [],
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <TopBar />

      {/* Horizontal Navigation for medium and small screens */}
      <div className="lg:hidden">
        <Navigation variant="horizontal" />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar for large screens */}
        <Navigation variant="sidebar" />

        <main className="flex-1 overflow-auto">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {/* Header with title and action buttons */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
                <h1 className="text-2xl font-semibold text-gray-900">
                  Data Mapping
                </h1>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsFilterOpen(true)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm rounded-md text-black bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <svg
                      className="-ml-0 mr-0 h-5 w-5 text-gray-400 sm:mr-2 sm:-ml-1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="hidden sm:inline">Filter</span>
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm rounded-md text-black bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <svg
                      className="-ml-0 mr-0 h-5 w-5 text-gray-400 sm:mr-2 sm:-ml-1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="hidden sm:inline">Export</span>
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm rounded-md text-black bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <svg
                      className="-ml-0 mr-0 h-5 w-5 text-gray-400 sm:mr-2 sm:-ml-1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 11-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="hidden sm:inline">Import</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCreateFormOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm rounded-md text-center justify-center text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 w-full"
                  >
                    <svg
                      className="mr-2 -ml-1 h-5 w-5"
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
                    <span className="">New Data</span>
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="mb-6">
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8 overflow-x-auto">
                    <button
                      onClick={() => setActiveTab("data-mapping")}
                      className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                        activeTab === "data-mapping"
                          ? "border-green-500 text-green-600"
                          : "border-transparent text-gray-500 hover:text-black hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center">
                        <svg
                          className="w-5 h-5 mr-2"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9 17H15M9 13H15M9 9H15M7 21H17C18.1046 21 19 20.1046 19 19V5C19 3.89543 18.1046 3 17 3H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Data Mapping
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveTab("collection-sources")}
                      className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                        activeTab === "collection-sources"
                          ? "border-green-500 text-green-600"
                          : "border-transparent text-gray-500 hover:text-black hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center">
                        <svg
                          className="w-5 h-5 mr-2"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4 7V17C4 19.2091 8.13401 21 13 21C17.866 21 22 19.2091 22 17V7M4 7C4 9.20914 8.13401 11 13 11C17.866 11 22 9.20914 22 7M4 7C4 4.79086 8.13401 3 13 3C17.866 3 22 4.79086 22 7M22 12C22 14.2091 17.866 16 13 16C8.13401 16 4 14.2091 4 12"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Collection Sources
                      </div>
                    </button>
                  </nav>
                </div>
              </div>

              {/* Edit and Visualize buttons */}
              <div className="flex items-center space-x-3 mb-4">
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-2 border border-green-600 shadow-sm rounded-md text-green-600 bg-white hover:bg-gray-50"
                >
                  <svg
                    className="mr-2 -ml-1 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  <span className="">Edit</span>
                </button>
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm rounded-md text-black bg-white hover:bg-gray-50"
                >
                  <svg
                    className="mr-2 -ml-1 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="">Visualize</span>
                </button>
              </div>

              {/* Content based on active tab */}
              {activeTab === "data-mapping" && (
                <DataMappingTable
                  filters={filters}
                  refreshTrigger={refreshTrigger}
                />
              )}
              {activeTab === "collection-sources" && (
                <div className="bg-white rounded-lg shadow p-6">
                  <p className="text-gray-500">
                    Collection Sources content will be implemented here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Create Data Form */}
      <CreateDataForm
        isOpen={isCreateFormOpen}
        onClose={() => setIsCreateFormOpen(false)}
        onSuccess={() => {
          setRefreshTrigger((prev) => prev + 1);
          setIsCreateFormOpen(false);
        }}
      />

      {/* Filter Panel */}
      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilter={handleApplyFilter}
        onResetFilter={handleResetFilter}
      />
    </div>
  );
}
