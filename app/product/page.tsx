"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Notification from "@/components/Notification";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  stock: number;
  category: string;
  rating: number;
  isDeleted?: boolean;
  deletedOn?: string;
}

export default function Product() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({
    show: false,
    message: '',
    type: 'info'
  });
  const productsPerPage = 8;
  const router = useRouter();

  const fetchProducts = () => {
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
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (productId: number) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setNotification({
        show: true,
        message: "Please log in first to delete a product.",
        type: 'error'
      });
       // Wait for 1 second before redirecting
    setTimeout(() => {
      router.push("/login");
    }, 1000);

    return;
     
    }

    try {
      const response = await fetch(`https://dummyjson.com/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const deletedProduct = await response.json();
        setProducts(prevProducts => 
          prevProducts.filter(product => product.id !== productId)
        );
        setNotification({
          show: true,
          message: `Successfully deleted product: ${deletedProduct.title}`,
          type: 'success'
        });
      } else {
        throw new Error('Failed to delete product');
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      setNotification({
        show: true,
        message: 'Failed to delete product',
        type: 'error'
      });
    }
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleView = (productId: number) => {
    router.push(`/product/${productId}`);
  };

  const handleAddProduct = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setNotification({
        show: true,
        message: "Please log in first to add a product.",
        type: "error",
      });
    
       // Wait for 1 second before redirecting
    setTimeout(() => {
      router.push("/login");
    }, 1000);

    return;
    }
    router.push("/product/add");
  };

  const handleUpdate = (productId: number) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setNotification({
        show: true,
        message: "Please log in first to update a product.",
        type: "error",
      });
     
      // Wait for 1 second before redirecting
    setTimeout(() => {
      router.push("/login");
    }, 1000);

    return;
    }
    router.push(`/product/update?id=${productId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Notification
        show={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification(prev => ({ ...prev, show: false }))}
      />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">Products</h1>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleAddProduct}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 whitespace-nowrap"
              >
                Add Product
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative pb-[56.25%]">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="absolute h-full w-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                    {product.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-blue-600">
                      ${product.price}
                    </span>
                    <span className="text-sm text-gray-500">
                      Stock: {product.stock}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-1">★</span>
                      <span className="text-sm text-gray-600">{product.rating}</span>
                    </div>
                    <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded-full">
                      {product.category}
                    </span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleView(product.id)}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleUpdate(product.id)}
                      className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this product?')) {
                          handleDelete(product.id);
                        }
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex justify-center">
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-md ${
                  currentPage === 1
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-md ${
                  currentPage === totalPages
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
