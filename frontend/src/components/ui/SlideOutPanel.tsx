import React from "react";
import { useScreenSize } from "@/hooks/useScreenSize";

interface SlideOutPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  width?: string;
}

export default function SlideOutPanel({
  isOpen,
  onClose,
  title,
  children,
  actions,
  width = "w-96",
}: SlideOutPanelProps) {
  const { isMobile } = useScreenSize();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />

      {/* Panel - responsive layout */}
      <div
        className={`fixed bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isMobile
            ? "inset-0 mt-16 rounded-t-lg flex flex-col"
            : `right-0 top-0 h-full ${width}`
        }`}
      >
        <div
          className={isMobile ? "flex flex-col h-full" : "flex flex-col h-full"}
        >
          {/* Header */}
          <div
            className={`flex items-center justify-between border-b border-gray-200 bg-white ${
              isMobile ? "p-4 rounded-t-lg" : "p-6"
            }`}
          >
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            {actions && (
              <div className="flex items-center space-x-3">{actions}</div>
            )}
          </div>

          {/* Content */}
          <div className={`flex-1 overflow-y-auto ${isMobile ? "p-4" : "p-6"}`}>
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
