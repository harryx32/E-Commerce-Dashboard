"use client";

import { useState } from "react";

export default function DeleteButton({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    try {
      setLoading(true);

      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      // simplest refresh (SSR safe)
      window.location.reload();
    } catch (error) {
      alert("Failed to delete product. Please try again.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <>
      {/* Delete Icon Button */}
      <button
        onClick={() => setOpen(true)}
        className="text-red-600 hover:text-red-800 text-sm cursor-pointer"
        title="Delete product"
      >
        Delete🗑️
      </button>

      {/* Confirmation Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl w-full max-w-sm p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900">
              Delete Product
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              Are you sure you want to delete this product?  
              
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setOpen(false)}
                disabled={loading}
                
                className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-700 cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={loading}
                className={`px-4 py-2 text-sm rounded-lg text-white
                  ${
                    loading
                      ? "bg-red-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700 cursor-pointer"
                  }
                `}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
