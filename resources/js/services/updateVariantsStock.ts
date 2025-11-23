// interface ProductVariant {
//     id: string;
//     productId?: string;
//     displayName: string;
//     image: string;
//     price: string;
//     quantity: number;
//     title: string;
// }

// export const updateVariantsStock = async (variants: ProductVariant[]) => {
//     try {
//         const response = await fetch(`/api/product/bulk-update-stock`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Accept": "application/json",
//             },
//             body: JSON.stringify({ variants }),
//         });

//         if (!response.ok) {
//             const errorText = await response.text();
//             console.error("Bulk update error:", errorText);
//             throw new Error("Failed to bulk update variant stocks.");
//         }

//         return await response.json();
//     } catch (error) {
//         console.error("Update Variants Stock error:", error);
//         throw error;
//     }
// };
