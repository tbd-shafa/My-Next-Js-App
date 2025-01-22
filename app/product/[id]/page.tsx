interface Product {
    id: number;
    title: string;
    description: string;
    category: string;
    price: number;
    rating: number;
    stock: number;
    tags: string[];
    brand: string;
    sku: string;
    weight: number;
    dimensions: {
      width: number;
      height: number;
      depth: number;
    };
    warrantyInformation: string;
    shippingInformation: string;
    availabilityStatus: string;
    reviews: {
      rating: number;
      comment: string;
      reviewerName: string;
    }[];
    images: string[];
  }
  
  async function fetchProduct(id: number): Promise<Product> {
    const response = await fetch(`https://dummyjson.com/products/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }
    return response.json();
  }
  
  export default async function ProductDetails({
    params,
  }: {
    params: { id: string };
  }) {
    const product = await fetchProduct(Number(params.id));
  
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">{product.title}</h1>
        <img src={product.images[0]} alt={product.title} className="mb-4 w-96" />
        <p className="mb-4">{product.description}</p>
        <div className="mb-2">
          <strong>Price:</strong> ${product.price}
        </div>
        <div className="mb-2">
          <strong>Category:</strong> {product.category}
        </div>
        <div className="mb-2">
          <strong>Stock:</strong> {product.stock}
        </div>
        <div className="mb-2">
          <strong>Rating:</strong> {product.rating}
        </div>
        <div>
          <strong>Tags:</strong> {product.tags.join(", ")}
        </div>
      </div>
    );
  }
  
//   export default async function ProductDetails(id: number){
//     // Correctly use backticks for template literals
//     console.log(id);
//     const data = await fetch(`https://dummyjson.com/products/1`);
//     const product = await data.json();
  
//     return (
//       <div>
        
//         <h1>{product.title}</h1>
//         <p>{product.description}</p>
//         <p>Price: ${product.price}</p>
//         {/* Add other product details as needed */}
//       </div>
//     );
//   }
  