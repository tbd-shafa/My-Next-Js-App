"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    router.push("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold">
            TechnoBD
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-blue-700 focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/about" className="hover:text-blue-200 transition-colors duration-200">
              About Us
            </Link>
            <Link href="/product" className="hover:text-blue-200 transition-colors duration-200">
              Product
            </Link>
            <Link href="/posts" className="hover:text-blue-200 transition-colors duration-200">
              Posts
            </Link>
            {isLoggedIn ? (
              <>
                <Link 
                  href="/profile" 
                  className="hover:text-blue-200 transition-colors duration-200"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors duration-200"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} pb-4`}>
          <div className="flex flex-col space-y-3">
            <Link href="/about" className="hover:bg-blue-700 px-3 py-2 rounded-md">
              About Us
            </Link>
            <Link href="/product" className="hover:bg-blue-700 px-3 py-2 rounded-md">
              Product
            </Link>
            <Link href="/posts" className="hover:bg-blue-700 px-3 py-2 rounded-md">
              Posts
            </Link>
            {isLoggedIn ? (
              <>
                <Link href="/profile" className="hover:bg-blue-700 px-3 py-2 rounded-md">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-left hover:bg-red-600 bg-red-500 px-3 py-2 rounded-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-white text-blue-600 px-3 py-2 rounded-md hover:bg-blue-50"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
