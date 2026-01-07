"use client";

import { useEffect } from "react";

export default function Toast({
  message,
  type = "success",
  onClose,
}: {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-lg text-sm text-white shadow-lg
        ${type === "success" ? "bg-green-600" : "bg-red-600"}
      `}
    >
      {message}
    </div>
  );
}
