"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { productSchema } from "@/lib/validators/product";
import Toast from "@/app/components/toast";

type Errors = {
  name?: string;
  price?: string;
  stock?: string;
  category?: string;
};

export default function CreateProductPage() {

  
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
  });
const [imageFile, setImageFile] = useState<File | null>(null);
const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
  message: string;
  type: "success" | "error";
} | null>(null);


  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setErrors({});

  let imageUrl = "";

  // 🔥 STEP 1: Upload image to Cloudinary
  if (imageFile) {
    const formData = new FormData();
    formData.append("file", imageFile);

    const uploadRes = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!uploadRes.ok) {
      setToast({
        message: "Failed to upload image. Please try again.",
        type: "error",
      });
      return;
    }

    const uploadData = await uploadRes.json();
    imageUrl = uploadData.url;
  }

  // 🔥 STEP 2: Validate product data
  const parsed = productSchema.safeParse({
    name: form.name,
    price: Number(form.price),
    stock: Number(form.stock),
    category: form.category,
  });

  if (!parsed.success) {
    const fieldErrors: Errors = {};
    parsed.error.issues.forEach((err) => {
      const field = err.path[0] as keyof Errors;
      fieldErrors[field] = err.message;
    });
    setErrors(fieldErrors);
    return;
  }

  // 🔥 STEP 3: Save product with image URL
  const productRes = await fetch("/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...parsed.data,
      imageUrl: imageUrl, // ✅ Cloudinary image URL
    }),
  });

  if (!productRes.ok) {
    setToast({
      message: "Failed to create product. Please try again.",
      type: "error",
    });
    return;
  }

  setToast({
    message: "Product created successfully",
    type: "success",
  });

  setTimeout(() => {
    router.push("/dashboard");
  }, 1000);
}

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0];
  if (!file) return;

  setImageFile(file);
  setImagePreview(URL.createObjectURL(file));
}


  return (
    <div className="max-w-3xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Create Product
        </h1>
        <p className="text-sm text-gray-500">
          Add a new product to your store
        </p>
      </div>


      {/* Form Card */}
      <div className="bg-white rounded-xl border shadow-sm">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image Upload */}
<div className="space-y-2">
  <label className="block text-sm font-medium text-gray-700">
    Product Image
  </label>

  {!imagePreview ? (
    <label
      className="flex flex-col items-center justify-center
                 border-2 border-dashed rounded-xl
                 h-40 cursor-pointer
                 hover:border-indigo-500
                 transition text-gray-500"
    >
      <span className="text-sm">Click to upload image</span>
      <span className="text-xs text-gray-400 mt-1">
        PNG, JPG up to 5MB
      </span>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
    </label>
  ) : (
    <div className="relative w-40 h-40">
      <img
        src={imagePreview}
        alt="Preview"
        className="w-full h-full object-cover rounded-xl border"
      />

      <button
        type="button"
        onClick={() => {
          setImageFile(null);
          setImagePreview(null);
        }}
        className="absolute -top-2 -right-2
                   bg-red-600 text-white
                   rounded-full w-7 h-7
                   flex items-center justify-center
                   text-xs hover:bg-red-700"
        title="Remove image"
      >
        ✕
      </button>
    </div>
  )}
</div>

          
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg 
           text-gray-900 placeholder-gray-400
           focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Enter product name"
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">
                {errors.name}
              </p>
            )}
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg 
           text-gray-900 placeholder-gray-400
           focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="₹0"
              />
              {errors.price && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.price}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock
              </label>
              <input
                name="stock"
                type="number"
                value={form.stock}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg 
           text-gray-900 placeholder-gray-400
           focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="0"
              />
              {errors.stock && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.stock}
                </p>
              )}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg 
           text-gray-900 placeholder-gray-400
           focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g. Footwear, Sports"
            />
            {errors.category && (
              <p className="text-sm text-red-600 mt-1">
                {errors.category}
              </p>
            )}
          </div>

          <hr />

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
  type="button"
  onClick={() => router.push("/dashboard")}
  className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50 cursor-pointer"
>
  Cancel
</button>


            <button
  type="submit"
  disabled={loading}
  className={`px-6 py-2 text-sm rounded-lg text-white
    ${loading
      ? "bg-indigo-400 cursor-not-allowed"
      : "bg-indigo-600 hover:bg-indigo-700 cursor-pointer"}
  `}
>
  {loading ? "Creating product..." : "Create Product"}
</button>

{toast && (
  <Toast
    message={toast.message}
    type={toast.type}
    onClose={() => setToast(null)}
  />
)}


          </div>
        </form>
      </div>
    </div>
  );
}
