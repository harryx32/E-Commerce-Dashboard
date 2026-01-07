import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Our Store
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Discover amazing products at great prices
        </p>
        <div className="space-x-4">
          <Link
            href="/store"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Shop Now
          </Link>
          <Link
            href="/login"
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
          >
            Login
          </Link>
        </div>
        <div className="mt-8 text-sm text-gray-500">
          <Link href="/login" className="hover:text-gray-700">
            Admin Panel Access
          </Link>
        </div>
      </div>
    </div>
  );
}
