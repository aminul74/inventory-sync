// import { useEffect, useState } from "react";
// import { fetchProduct } from "../services/singleProductApi";

// type ProductVariant = {
//   displayName: string;
//   image: string;
//   price: string;
//   quantity: number;
//   title: string;
// };

// type Location = {
//   id: string;
//   name: string;
//   address: Object
// };

// type Product = {
//     title: string;
//     currency: string;
//     image: string;
//     imgAlt: string;
//     status: string;
//     variants: ProductVariant[];
//     locations: Location[]
// }

// export function useProduct(productId: string) {
//   const [product, setProduct] = useState<Product | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   const loadProduct = async () => {
//     try {
//       setLoading(true);
//       const data = await fetchProduct(productId);
//       setProduct(data || []);
//       setLoading(false);
//     } catch (err) {
//       setError("Someting went wrong while fetching products.");
//       console.error("Error fetching products:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadProduct();
//   }, []);

//   return {
//     product,
//     loading,
//     error
//   };
// }
