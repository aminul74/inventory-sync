// import { useState } from "react";
// import { updateVariantsStock } from "../services/updateVariantsStock";

// interface ProductVariant {
//     id: string;
//     productId?: string;
//     displayName: string;
//     image: string;
//     price: string;
//     quantity: number;
//     title: string;
// }

// export function useVariantStockUpdate() {
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);

//     const updateStock = async (variants: ProductVariant[]) => {
//         setLoading(true);
//         setError(null);

//         try {
//             const result = await updateVariantsStock(variants);
//             return result;
//         } catch (err) {
//             setError("Bulk update failed.");
//             throw err;
//         } finally {
//             setLoading(false);
//         }
//     };

//     return {
//         updateStock,
//         loading,
//         error,
//     };
// }
