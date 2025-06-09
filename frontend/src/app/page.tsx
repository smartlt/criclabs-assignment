"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    // Only redirect to dashboard if we have both token and user data
    if (token && userData) {
      try {
        // Validate that user data is valid JSON
        JSON.parse(userData);
        router.push("/dashboard");
      } catch {
        // Invalid user data, clear and redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // console.log("Invalid user data, redirecting to login");
        router.push("/login");
      }
    } else {
      // No token or user data, redirect to login
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Loading...</h1>
      </div>
    </div>
  );
}
