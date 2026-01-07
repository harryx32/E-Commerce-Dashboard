"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface AddToCartButtonProps {
  productId: string;
}

export default function AddToCartButton({ productId }: AddToCartButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const addToCart = async () => {
    if (!session) {
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      if (res.ok) {
        alert("Added to cart!");
        // Refresh cart count
        window.location.reload();
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to add to cart");
      }
    } catch (error) {
      alert("Error adding to cart");
    }
    setLoading(false);
  };

  return (
    <button
      onClick={addToCart}
      disabled={loading}
      className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 disabled:opacity-50"
    >
      {loading ? "Adding..." : "Add to Cart"}
    </button>
  );
}