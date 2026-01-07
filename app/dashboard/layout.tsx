"use client";

import Sidebar from "../components/sidebar";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
     <main className="flex-1 bg-gray-50">
  {/* Page Content */}
  <div className="p-8">
    {children}
  </div>
</main>

    </div>
  );
}
