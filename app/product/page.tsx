// export default function Product() {
//     return (
//       <div>
//         <h1>Products</h1>
//         <p>Explore our range of amazing products crafted with precision and care.</p>
//       </div>
//     );
//   }
//   export default async function Product() {
//     const data = await fetch('https://api.vercel.app/blog')
//     const posts = await data.json()
//     return (
//       <ul>
//         {posts.map((post) => (
//           <li key={post.id}>{post.title}</li>
//         ))}
//       </ul>
//     )
//   }  
//https://dummyjson.com/

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

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Products Table</h1>
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
