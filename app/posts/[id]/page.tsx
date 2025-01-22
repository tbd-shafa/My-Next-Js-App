interface Post {
    id: number;
    title: string;
    body: string;
    tags: string[];
    reactions: {
      likes: number;
      dislikes: number;
    };
    views: number;
  }
  
  async function fetchPost(id: number): Promise<Post> {
    const response = await fetch(`https://dummyjson.com/posts/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch post");
    }
    return response.json();
  }
  
  export default async function PostDetails({
    params,
  }: {
    params: { id: string };
  }) {
    const post = await fetchPost(Number(params.id));
  
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Post Details</h1>
        <div className="border border-gray-300 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
          <p className="mb-4">{post.body}</p>
          <div className="mb-2">
            <strong>Tags:</strong> {post.tags.join(", ")}
          </div>
          <div className="mb-2">
            <strong>Likes:</strong> {post.reactions.likes}
          </div>
          <div className="mb-2">
            <strong>Dislikes:</strong> {post.reactions.dislikes}
          </div>
          <div>
            <strong>Views:</strong> {post.views}
          </div>
        </div>
      </div>
    );
  }
  