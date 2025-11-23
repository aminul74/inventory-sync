// import React from "react";
// import { IndexTable, Thumbnail, Badge } from "@shopify/polaris";
// import { formatPriceRange, capitalizeFirstLetter } from "../../utils/formatters";
// import { useNavigate } from "react-router";

// type ProductRowProps = {
//     product: {
//         id: string;
//         title: string;
//         image?: string;
//         imgAlt?: string;
//         minPrice: number;
//         maxPrice: number;
//         currency: string;
//         quantity: number;
//         status: string;
//     };
//     position: number;
//     selected: boolean;
// };

// const ProductRow: React.FC<ProductRowProps> = ({ product, position, selected }) => {
//     const navigate = useNavigate();
//     const handleNavigateToEditProduct = (productId: string) => {
//         const id = productId.match(/\d+$/)?.[0];
//         navigate(`/products/${id}`, {
//             replace: true,
//         });
//     };

//     return (
//         <IndexTable.Row
//             id={product.id}
//             position={position}
//             selected={selected}
//             onClick={() => handleNavigateToEditProduct(product.id)}
//         >
//             <IndexTable.Cell>
//                 <Thumbnail
//                     source={product.image || "https://via.placeholder.com/50"}
//                     alt={product.imgAlt || "Product Image"}
//                     size="small"
//                 />
//             </IndexTable.Cell>
//             <IndexTable.Cell>{product.title}</IndexTable.Cell>
//             <IndexTable.Cell>
//                 {formatPriceRange(product.minPrice, product.maxPrice, product.currency)}
//             </IndexTable.Cell>
//             <IndexTable.Cell>{product.quantity}</IndexTable.Cell>
//             <IndexTable.Cell>
//                 <Badge tone="success">
//                     {capitalizeFirstLetter(product.status)}
//                 </Badge>
//             </IndexTable.Cell>
//         </IndexTable.Row>
//     );
// };

// export default ProductRow;
