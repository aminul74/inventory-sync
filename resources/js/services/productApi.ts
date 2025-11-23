// export const fetchProducts = async (params: { after?: string; before?: string } = {}) => {
//     try {
//         const queryParams = new URLSearchParams(params).toString();
//         const url = `/api/products${queryParams ? `?${queryParams}` : ""}`;
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
//         console.error("API fetchProducts error:", error);
//         throw error;
//     }
// };
