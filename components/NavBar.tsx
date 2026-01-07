"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NavBar() {
  const { data: session } = useSession();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (session?.user.role === "user") {
      fetch("/api/cart")
        .then(res => res.json())
        .then(data => {
          const count = data.items?.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0) || 0;
          setCartCount(count);
        })
        .catch(() => setCartCount(0));
    }
  }, [session]);

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Our Store
          </Link>

          <div className="flex items-center space-x-4">
            <Link href="/store" className="text-gray-700 hover:text-gray-900">
              Products
            </Link>

            {session ? (
              <>
                {session.user.role === "user" && (
                  <>
                    <Link href="/cart" className="relative text-gray-700 hover:text-gray-900">
                      🛒 Cart
                      {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {cartCount}
                        </span>
                      )}
                    </Link>
                    <Link href="/orders" className="text-gray-700 hover:text-gray-900">
                      Orders
                    </Link>
                    <Link href="/profile" className="text-gray-700 hover:text-gray-900">
                      Profile
                    </Link>
                  </>
                )}
                {session.user.role === "admin" && (
                  <Link href="/dashboard" className="text-gray-700 hover:text-gray-900">
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={() => signOut()}
                  className="text-gray-700 hover:text-gray-900"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-gray-900">
                  Login
                </Link>
                <Link href="/register" className="text-gray-700 hover:text-gray-900">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}