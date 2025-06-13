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
          <div className="w-8 h-8  text-green-600 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
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
