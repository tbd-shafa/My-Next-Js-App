"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function UpdateProduct() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");

  useEffect(() => {
    if (!productId) {
      setError("Product ID is missing.");
      setLoading(false);
      return;
    }

    fetch(`https://dummyjson.com/products/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        setTitle(data.title);
        setPrice(data.price);
        setCategory(data.category);
        setStock(data.stock);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product details:", error);
        setError("Failed to load product details.");
        setLoading(false);
      });
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!token || !refreshToken) {
      alert("Please log in to update a product.");
      return;
    }

    try {
      const res = await fetch(`https://dummyjson.com/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, price, category, stock }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Product updated successfully!");
        router.push("/product"); // Navigate back to the product list
      } else {
        setError(data.message || "Failed to update product.");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      setError("An error occurred while updating the product.");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="p-8 max-w-md mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">
        Update Product
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Product Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
          required
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
          required
        />
        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition-all"
        >
          Update Product
        </button>
      </form>
      {error && (
        <p className="text-red-500 mt-4 text-center bg-red-100 p-2 rounded">
          {error}
        </p>
      )}
    </div>
  );
  
}
