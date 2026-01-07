"use client";

import Image from "next/image";
import { useState } from "react";

interface CartItemProps {
  item: {
    _id: string;
    product: {
      _id: string;
      name: string;
      imageUrl: string;
    };
    name: string;
    price: number;
    quantity: number;
    image: string;
  };
}

export default function CartItem({ item }: CartItemProps) {
  const [quantity, setQuantity] = useState(item.quantity);
  const [loading, setLoading] = useState(false);

  const updateQuantity = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/cart/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }),
      });
      if (res.ok) {
        setQuantity(newQuantity);
      }
    } catch (error) {
      alert("Failed to update quantity");
    }
    setLoading(false);
  };

  const removeItem = async () => {
    setLoading(true);
    try {
      await fetch(`/api/cart/${item._id}`, { method: "DELETE" });
      window.location.reload();
    } catch (error) {
      alert("Failed to remove item");
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center border rounded p-4">
      <Image
        src={item.image || "/placeholder.svg"}
        alt={item.name}
        width={100}
        height={100}
        className="w-24 h-24 object-cover rounded mr-4"
      />
      <div className="flex-1">
        <h3 className="text-lg font-semibold">{item.name}</h3>
        <p>${item.price}</p>
      </div>
      <div className="flex items-center">
        <button
          onClick={() => updateQuantity(quantity - 1)}
          disabled={loading}
          className="px-2 py-1 border rounded"
        >
          -
        </button>
        <span className="mx-2">{quantity}</span>
        <button
          onClick={() => updateQuantity(quantity + 1)}
          disabled={loading}
          className="px-2 py-1 border rounded"
        >
          +
        </button>
      </div>
      <button
        onClick={removeItem}
        disabled={loading}
        className="ml-4 text-red-500 hover:text-red-700"
      >
        Remove
      </button>
    </div>
  );
}