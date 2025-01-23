"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    
    if (!refreshToken) {
      setError('No refresh token found');
      router.push("/login");
      return null;
    }

    try {
      const response = await fetch("https://dummyjson.com/auth/refresh", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken: refreshToken,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        return data.accessToken;
      } else {
        throw new Error('Failed to refresh token');
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      router.push("/login");
      return null;
    }
  };

  const fetchUser = async () => {
    let token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch("https://dummyjson.com/auth/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        const newToken = await refreshToken();
        if (newToken) {
          const retryResponse = await fetch("https://dummyjson.com/auth/me", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${newToken}`,
            },
          });
          if (retryResponse.ok) {
            const data = await retryResponse.json();
            setUser(data);
            return;
          }
        }
        router.push("/login");
      } else if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        router.push("/login");
      }
    } catch (err) {
      console.error(err);
      router.push("/login");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (!user) return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8">
              <div className="flex items-center">
                <img
                  src={user.image}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="h-24 w-24 rounded-full border-4 border-white shadow-lg"
                />
                <div className="ml-6">
                  <h1 className="text-3xl font-bold text-white">
                    {user.firstName} {user.lastName}
                  </h1>
                  <p className="text-blue-100 mt-1">@{user.username}</p>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="mt-1 text-lg font-medium text-gray-900">{user.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                    <p className="mt-1 text-lg font-medium text-gray-900">{user.phone}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Gender</h3>
                    <p className="mt-1 text-lg font-medium text-gray-900 capitalize">{user.gender}</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Address</h3>
                    <p className="mt-1 text-lg font-medium text-gray-900">
                      {user.address?.address}, {user.address?.city}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Company</h3>
                    <p className="mt-1 text-lg font-medium text-gray-900">{user.company?.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Department</h3>
                    <p className="mt-1 text-lg font-medium text-gray-900">{user.company?.department}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}