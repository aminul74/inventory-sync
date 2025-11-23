// import {
//     IndexTable,
//     SkeletonThumbnail,
//     SkeletonBodyText,
//     SkeletonDisplayText,
//     Card,
//     useIndexResourceState,
//     Page,
//   } from '@shopify/polaris';
//   import React from 'react';
  
//   const ProductTableSkeleton = () => {
//     const itemCount = 5;
//     const resourceName = {
//       singular: 'product',
//       plural: 'products',
//     };
  
//     const {selectedResources, allResourcesSelected, handleSelectionChange} =
//       useIndexResourceState([]);
  
//     return (
//         <Page title="Products">
//             <Card padding="0">
//                 <IndexTable
//                 resourceName={resourceName}
//                 itemCount={itemCount}
//                 selectedItemsCount={allResourcesSelected ? 'All' : selectedResources.length}
//                 onSelectionChange={handleSelectionChange}
//                 headings={[
//                     {title: 'Image'},
//                     {title: 'Title'},
//                     {title: 'Price'},
//                     {title: 'Quantity'},
//                     {title: 'Status'},
//                 ]}
//                 >
//                 {Array.from({length: itemCount}).map((_, index) => (
//                     <IndexTable.Row
//                     id={`skeleton-${index}`}
//                     key={index}
//                     selected={false}
//                     position={index}
//                     >
//                     <IndexTable.Cell>
//                         <SkeletonThumbnail size="small" />
//                     </IndexTable.Cell>
//                     <IndexTable.Cell>
//                         <SkeletonBodyText lines={1} />
//                     </IndexTable.Cell>
//                     <IndexTable.Cell>
//                         <SkeletonDisplayText size="small" />
//                     </IndexTable.Cell>
//                     <IndexTable.Cell>
//                         <SkeletonDisplayText size="small" />
//                     </IndexTable.Cell>
//                     <IndexTable.Cell>
//                         <SkeletonDisplayText size="small" />
//                     </IndexTable.Cell>
//                     </IndexTable.Row>
//                 ))}
//                 </IndexTable>
//             </Card>
//         </Page>
//     );
//   };
  
//   export default ProductTableSkeleton;
  