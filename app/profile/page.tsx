"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  const fetchUser = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        alert('please login..');
        router.push("/login");
        return;
      }

    try {
      const response = await fetch("https://dummyjson.com/auth/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
       // credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        //alert("Failed to fetch user data.");
        router.push("/login");
      }
    } catch (err) {
      console.error(err);
      router.push("/login");
    }
  };

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    
  
    if (!refreshToken) {
      setError('No refresh token found');
      return;
    }

    try {
      const response = await fetch("https://dummyjson.com/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken, expiresInMins: 30 }),
        //credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        alert('Session refreshed!');
      }
    } catch (err) {
      console.error("Failed to refresh token.");
    }
  };
  const handleLogout = () => {
    // Clear the tokens from localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    router.push("/login");
  };
  useEffect(() => {
    fetchUser();

    const refreshInterval = setInterval(refreshToken, 30 * 60 * 1000); // Refresh token every 30 minutes
    return () => clearInterval(refreshInterval);
  }, []);

  if (!user) {
     <p>Loading...</p>;
    return;
  }


return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Profile</h1>
        
        <div className="flex justify-center mb-6">
          <img
            src={user.image}
            alt={`${user.firstName} ${user.lastName}`}
            className="rounded-full w-32 h-32 object-cover border-4 border-blue-500"
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between">
            <strong className="text-gray-700">Name:</strong>
            <span className="text-gray-600">{user.firstName} {user.lastName}</span>
          </div>

          <div className="flex justify-between">
            <strong className="text-gray-700">Username:</strong>
            <span className="text-gray-600">{user.username}</span>
          </div>

          <div className="flex justify-between">
            <strong className="text-gray-700">Email:</strong>
            <span className="text-gray-600">{user.email}</span>
          </div>

          <div className="flex justify-between">
            <strong className="text-gray-700">Gender:</strong>
            <span className="text-gray-600">{user.gender}</span>
          </div>
          </div>

            <div className="mt-6 flex justify-center">
            <button
                onClick={handleLogout}
                className="w-full py-3 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition duration-200"
            >
                Logout
            </button>
            </div>
            </div>
            </div>
            );
        }
  