// export const fetchProduct = async (productId: string) => {
//     try {
//         const url = `/api/product/${productId}`;
//         const response = await fetch(url, {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//         });

//         if (!response.ok) {
//             throw new Error("Network response issues");
//         }
//         const data = await response.json();
//         return data;
//     } catch (error) {
//         console.error("API fetchProduct error:", error);
//         throw error;
//     }
// };
