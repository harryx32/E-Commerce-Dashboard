"use client";

import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // 🔒 Session loading → kuch render mat karo
  if (status === "loading") return null;

  // 🔒 Not logged in → sidebar hi mat dikhao
  if (!session) return null;

  const isDashboardActive =
    pathname.startsWith("/dashboard") &&
    pathname !== "/dashboard/create";

  const isCreateActive = pathname === "/dashboard/create";

  return (
    <aside className="w-64 bg-white border-r flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b">
        <span className="text-xl font-bold text-indigo-600">
          Admin Panel
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        <Link
          href="/dashboard"
          className={`flex px-4 py-2 rounded-lg text-sm font-medium
            ${
              isDashboardActive
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
        >
          📊 Dashboard
        </Link>

        <Link
          href="/dashboard/create"
          className={`flex px-4 py-2 rounded-lg text-sm font-medium
            ${
              isCreateActive
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
        >
          ➕ Create Product
        </Link>
      </nav>

      {/* Footer */}
      <div className="border-t px-6 py-4 text-sm">
        <p className="text-gray-500">Logged in as</p>
        <p className="font-medium text-gray-800 truncate">
          {session.user?.email}
        </p>

        <button
          onClick={() => signOut()}
          className="mt-3 text-red-600 text-sm hover:underline"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
