import React from "react";

export default function TopBar() {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const fallback = img.nextElementSibling as HTMLElement;
    if (fallback) {
      img.style.display = "none";
      fallback.style.display = "flex";
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Logo and Title */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-lg font-semibold text-gray-900">PDPA</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">International School</span>
            <svg
              className="w-4 h-4 text-gray-400 ml-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {/* Right side - User Avatar */}
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
            <img
              src="/api/placeholder/32/32"
              alt="User Avatar"
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
            <div className="w-full h-full bg-gray-400 flex items-center justify-center text-white text-sm font-medium hidden">
              U
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
