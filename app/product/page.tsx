"use client";

import { useRouter } from "next/navigation"; // For navigation
import { useEffect, useState } from "react";

export default function Product() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  const router = useRouter(); // Initialize router

  useEffect(() => {
    fetch("https://dummyjson.com/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data.products);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, []);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(products.length / productsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleView = (productId: number) => {
    router.push(`/product/${productId}`); // Navigate to the product details page
  };

  const handleAddProduct = () => {
    const token = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (token && refreshToken) {
      router.push("/product/add"); // Navigate to the add product page
    } else {
      alert("Please log in first to add a product.");
    }
  };

  const handleUpdate = (productId: number) => {
    const token = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
  
    if (token && refreshToken) {
      router.push(`/product/update?id=${productId}`); // Navigate to the update product page
    } else {
      alert("Please log in first to update a product.");
    }
  };
  const handleDelete = async (productId: number) => {
    const token = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (token && refreshToken) {
      const confirmed = window.confirm("Are you sure you want to delete this product?");
      if (confirmed) {
        try {
          const response = await fetch(`https://dummyjson.com/products/${productId}`, {
            method: "DELETE",
          });
          const data = await response.json();
          if (data.isDeleted) {
            alert(`Product with ID ${productId} was successfully deleted.`);
            setProducts((prevProducts) =>
              prevProducts.filter((product) => product.id !== productId)
            );
          } else {
            alert("Failed to delete the product. Please try again.");
          }
        } catch (error) {
          console.error("Error deleting product:", error);
          alert("An error occurred while deleting the product.");
        }
      }
    } else {
      alert("Please log in first to delete a product.");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Products Table</h1>
      <button
        onClick={handleAddProduct}
        className="px-4 py-2 bg-green-500 text-white rounded mb-4"
      >
        Add Product
      </button>
      <table className="table-auto border-collapse border border-gray-300 w-full">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Title</th>
            <th className="border border-gray-300 px-4 py-2">Category</th>
            <th className="border border-gray-300 px-4 py-2">Price</th>
            <th className="border border-gray-300 px-4 py-2">Rating</th>
            <th className="border border-gray-300 px-4 py-2">Stock</th>
            <th className="border border-gray-300 px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map((product) => (
            <tr key={product.id}>
              <td className="border border-gray-300 px-4 py-2">{product.id}</td>
              <td className="border border-gray-300 px-4 py-2">{product.title}</td>
              <td className="border border-gray-300 px-4 py-2">{product.category}</td>
              <td className="border border-gray-300 px-4 py-2">${product.price}</td>
              <td className="border border-gray-300 px-4 py-2">{product.rating}</td>
              <td className="border border-gray-300 px-4 py-2">{product.stock}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  onClick={() => handleView(product.id)}
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  View
                </button>
                <button
                  onClick={() => handleUpdate(product.id)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded"
                >
                  Update
              </button>

              <button
                  onClick={() => handleDelete(product.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>

              </td>
              
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            className={`px-4 py-2 mx-1 border ${
              currentPage === i + 1
                ? "bg-blue-500 text-white"
                : "bg-white text-blue-500 border-blue-500"
            } rounded`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
