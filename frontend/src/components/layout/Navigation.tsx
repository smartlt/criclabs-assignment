import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  id: string;
  title: string;
  path: string;
  icon: React.ReactNode;
}

interface NavigationProps {
  variant: "horizontal" | "sidebar";
}

const navItems: NavItem[] = [
  {
    id: "data-mapping",
    title: "Data Mapping",
    path: "/data-mapping",
    icon: (
      <svg
        className="w-5 h-5"
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
    ),
  },
  {
    id: "governance",
    title: "Governance Document",
    path: "/governance",
    icon: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7 21H17C18.1046 21 19 20.1046 19 19V5C19 3.89543 18.1046 3 17 3H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "employee-awareness",
    title: "Employee Awareness",
    path: "/employee-awareness",
    icon: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "data-processors",
    title: "Data Processors",
    path: "/data-processors",
    icon: (
      <svg
        className="w-5 h-5"
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
    ),
  },
  {
    id: "subject-access-request",
    title: "Subject Access Request",
    path: "/subject-access-request",
    icon: (
      <svg
        className="w-5 h-5"
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
    ),
  },
  {
    id: "data-breach-register",
    title: "Data breach register",
    path: "/data-breach-register",
    icon: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function Navigation({ variant }: NavigationProps) {
  const pathname = usePathname();

  if (variant === "horizontal") {
    return (
      <nav className="border-b border-gray-200 px-4 py-3">
        <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.id}
                href={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  isActive
                    ? "text-green-600 bg-green-50"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.icon}
                <span className="text-sm font-medium">{item.title}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    );
  }

  // Sidebar variant
  return (
    <aside className="hidden lg:block w-64 min-h-screen">
      <div className="px-6 py-6">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.id}
                href={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "text-green-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.icon}
                <span className="text-sm font-medium">{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
