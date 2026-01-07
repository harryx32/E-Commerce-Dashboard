"use client";



import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#6366f1", "#22c55e", "#f97316", "#ef4444"];

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
}

export default function Charts({ products }: { products: Product[] }) {
  const hasProducts = products.length > 0;
  /* --------- CATEGORY DATA --------- */
  const categoryMap: Record<string, number> = {};

  products.forEach((p) => {
    categoryMap[p.category] =
      (categoryMap[p.category] || 0) + 1;
  });

  const categoryData = Object.keys(categoryMap).map(
    (key) => ({
      name: key,
      value: categoryMap[key],
    })
  );

  /* --------- STOCK DATA --------- */
  const stockData = [
    {
      name: "Low Stock",
      value: products.filter((p) => p.stock < 10).length,
    },
    {
      name: "Healthy Stock",
      value: products.filter((p) => p.stock >= 10).length,
    },
  ];

  return (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

    {/* Products by Category */}
    <div className="bg-white border rounded-xl p-6 shadow-sm">
      <h3 className="text-sm font-medium text-gray-600 mb-4">
        Products by Category
      </h3>

      {categoryData.length === 0 ? (
        <div className="h-[250px] flex items-center justify-center text-sm text-gray-500">
          No category data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="name"
              outerRadius={90}
            >
              {categoryData.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
  cursor={{ fill: "rgba(99,102,241,0.08)" }}
  contentStyle={{
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    fontSize: "12px",
  }}
/>

          </PieChart>
        </ResponsiveContainer>
      )}
    </div>

    {/* Stock Overview */}
    <div className="bg-white border rounded-xl p-6 shadow-sm">
      <h3 className="text-sm font-medium text-gray-600 mb-4">
        Stock Overview
      </h3>

      {!hasProducts ? (
        <div className="h-[250px] flex items-center justify-center text-sm text-gray-500">
          No stock data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={stockData}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip
  cursor={{ fill: "rgba(99,102,241,0.08)" }}
  contentStyle={{
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    fontSize: "12px",
  }}
/>

            <Bar
              dataKey="value"
              fill="#6366f1"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  </div>
);

}
