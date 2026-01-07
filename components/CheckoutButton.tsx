"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface CartItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Cart {
  items: CartItem[];
}

export default function CheckoutButton({ cart }: { cart: Cart }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shippingAddress: {
            street: "123 Main St",
            city: "Anytown",
            state: "CA",
            zipCode: "12345",
            country: "USA",
          },
        }),
      });

      if (res.ok) {
        router.push("/orders");
      } else {
        alert("Checkout failed");
      }
    } catch (error) {
      alert("Error during checkout");
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 disabled:opacity-50"
    >
      {loading ? "Processing..." : "Checkout"}
    </button>
  );
}