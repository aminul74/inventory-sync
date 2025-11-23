// import { useEffect, useState } from "react";
// import { fetchProducts } from "../services/productApi";

// export function useProducts() {
//   const [products, setProducts] = useState<any[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [hasNextPage, setHasNextPage] = useState<boolean>(false);
//   const [hasPreviousPage, setHasPreviousPage] = useState<boolean>(false);
//   const [lastCursor, setLastCursor] = useState<string | null>(null);
//   const [firstCursor, setFirstCursor] = useState<string | null>(null);

//   const loadProducts = async (params: { after?: string; before?: string } = {}) => {
//     try {
//       setLoading(true);
//       const data = await fetchProducts(params);
//       setProductStates(data);
//       setLoading(false);
//     } catch (err) {
//       setError("Someting went wrong while fetching products.");
//       console.error("Error fetching products:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadProducts();
//   }, []);

//   const fetchNext = () => {
//     if (lastCursor) {
//       loadProducts({ after: lastCursor });
//     }
//   };

//   const fetchPrevious = () => {
//     if (firstCursor) {
//       loadProducts({ before: firstCursor });
//     }
//   };

//   const setProductStates = (data: any) => {
//     setProducts(data?.products || []);
//     setHasNextPage(data?.pageInfo?.hasNextPage || false);
//     setHasPreviousPage(data?.pageInfo?.hasPreviousPage || false);
//     setFirstCursor(data?.products[0]?.cursor || null);
//     setLastCursor(data?.products[data?.products.length - 1]?.cursor || null);
//   }

//   return {
//     products,
//     loading,
//     error,
//     hasNextPage,
//     hasPreviousPage,
//     fetchNext,
//     fetchPrevious,
//   };
// }
