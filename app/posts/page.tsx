// export default function Posts() {
//     return (
//       <div>
//         <h1>Posts</h1>
//         <p>Here are all the latest posts and updates from our team.</p>
//       </div>
//     );
//   }

//   export default async function Posts() {
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
"use client";

import { useRouter } from "next/navigation"; // Use router for navigation
import { useEffect, useState } from "react";

export default function Posts() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 7;
  const router = useRouter(); // Initialize router

  useEffect(() => {
    fetch("https://dummyjson.com/posts")
      .then((response) => response.json())
      .then((data) => {
        setPosts(data.posts);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        setLoading(false);
      });
  }, []);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(posts.length / postsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleView = (postId: number) => {
    router.push(`/posts/${postId}`); // Navigate to the post details page
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Posts Table</h1>
      <table className="table-auto border-collapse border border-gray-300 w-full">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Title</th>
            <th className="border border-gray-300 px-4 py-2">Body</th>
            <th className="border border-gray-300 px-4 py-2">Tags</th>
            <th className="border border-gray-300 px-4 py-2">Likes</th>
            <th className="border border-gray-300 px-4 py-2">Dislikes</th>
            <th className="border border-gray-300 px-4 py-2">Views</th>
            <th className="border border-gray-300 px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentPosts.map((post) => (
            <tr key={post.id}>
              <td className="border border-gray-300 px-4 py-2">{post.id}</td>
              <td className="border border-gray-300 px-4 py-2">{post.title}</td>
              <td className="border border-gray-300 px-4 py-2">{post.body}</td>
              <td className="border border-gray-300 px-4 py-2">
                {post.tags.join(", ")}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {post.reactions.likes}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {post.reactions.dislikes}
              </td>
              <td className="border border-gray-300 px-4 py-2">{post.views}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  onClick={() => handleView(post.id)}
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


