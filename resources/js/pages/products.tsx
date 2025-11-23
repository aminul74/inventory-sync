// import React from "react";
// import { Card, IndexTable, Page, useIndexResourceState } from "@shopify/polaris";
// import { useProducts } from "../hooks/useProducts";
// import ErrorPage from "../components/Error";
// import ProductTableSkeleton from "../components/Skeletons/Table";
// import ProductRow from "../components/Products/ProductRow";

// const Products = () => {
//   const {
//     products,
//     loading,
//     error,
//     hasNextPage,
//     hasPreviousPage,
//     fetchNext,
//     fetchPrevious,
//   } = useProducts();

//   const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(products);

//   if (loading) {
//     return <ProductTableSkeleton />;
//   }

//   if (error) {
//     return <ErrorPage errorMessage={error} />;
//   }

//   return (
//     <Page title="Products">
//       <Card padding="0">
//         <IndexTable
//           resourceName={{ singular: "product", plural: "products" }}
//           itemCount={products?.length}
//           headings={[
//             { title: "Image" },
//             { title: "Title" },
//             { title: "Price" },
//             { title: "Quantity" },
//             { title: "Status" },
//           ]}
//           selectedItemsCount={
//             allResourcesSelected ? 'All' : selectedResources.length
//           }
//           onSelectionChange={handleSelectionChange}
//           pagination={{
//             hasNext: hasNextPage,
//             onNext: fetchNext,
//             hasPrevious: hasPreviousPage,
//             onPrevious: fetchPrevious,
//           }}
//         >
//           {products?.map((product, index) => (
//             <ProductRow
//               key={product.id}
//               product={product}
//               position={index}
//               selected={selectedResources.includes(product.id)}
//             />
//           ))}
//         </IndexTable>
//       </Card>
//     </Page>
//   );
// }

// export default Products;
