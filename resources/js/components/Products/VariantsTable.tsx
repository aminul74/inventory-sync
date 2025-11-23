// import {
//     IndexTable,
//     Card,
//     Text,
//     Thumbnail,
//     Button,
//     TextField,
//     Select,
//     Box,
// } from '@shopify/polaris';
// import React, { useCallback, useEffect, useState } from 'react';
// import LocationSelect from '../LocationSelect';

// interface Variant {
//     id: string;
//     displayName: string;
//     image: string;
//     price: string;
//     quantity: number;
//     title: string;
// }

// interface VariantsTableProps {
//     currency: string;
//     variants: Variant[];
//     locations: { id: string; name: string }[];
//     onQuantityChange: (hasChanged: boolean) => void;
//     onVariantsUpdate: (updatedVariants: Variant[]) => void;
// }

// const VariantsTable: React.FC<VariantsTableProps> = ({ currency, variants, locations, onQuantityChange, onVariantsUpdate }) => {
//     const [visibleCount, setVisibleCount] = useState<number>(10);
//     const [variantList, setVariantList] = useState<Variant[]>(variants);
//     const [initialVariantList, setInitialVariantList] = useState<Variant[]>(variants);

//     const [selectedLocation, setSelectedLocation] = useState('');

//     const handleSelectLocation = useCallback(
//         (value: string) => setSelectedLocation(value),
//         [],
//     );

//     const maxCount = Math.min(variantList.length, 100);
//     const visibleVariants = variantList.slice(0, visibleCount);
//     const isShopLocationSelected = locations.find(loc => loc.name === "Shop location")?.id === selectedLocation;

//     const handleSeeMore = () => {
//         setVisibleCount((prev) => Math.min(prev + 10, maxCount));
//     };

//     const updateVariantQuantity = (id: string, newQuantity: number) => {
//         const updatedList = variantList.map(variant =>
//             variant.id === id ? { ...variant, quantity: newQuantity } : variant
//         );
//         setVariantList(updatedList);

//         const changedVariants = updatedList.filter(updated => {
//             const original = initialVariantList.find(v => v.id === updated.id);
//             return original?.quantity !== updated.quantity;
//         });

//         const hasChanges = changedVariants.length > 0;

//         onQuantityChange(hasChanges);
//         onVariantsUpdate(changedVariants);
//     };

//     useEffect(() => {
//         setVariantList(variants);
//         setInitialVariantList(variants);
//     }, [variants]);

//     const resourceName = {
//         singular: 'variant',
//         plural: 'variants',
//     };

//     const rowMarkup = visibleVariants.map(
//         ({ id, displayName, image, price, quantity, title }, index: number) => {
//             const parts = title.split(' / ');
//             const firstPart = parts[0];
//             const secondPart = parts.slice(1).join(' / ');

//             return (
//                 <IndexTable.Row
//                     id={id}
//                     key={id}
//                     position={index}
//                 >
//                     <IndexTable.Cell>
//                         <div
//                             style={{
//                                 display: 'flex',
//                                 alignItems: 'center',
//                                 padding: '8px 0',
//                             }}
//                         >
//                             <Thumbnail source={image} alt={displayName} size="small" />
//                             <div
//                                 style={{
//                                     marginLeft: '10px',
//                                     display: 'flex',
//                                     flexDirection: 'column',
//                                     justifyContent: 'center',
//                                 }}
//                             >
//                                 <Text variant="bodyMd" fontWeight="bold" as="span">
//                                     {firstPart}
//                                 </Text>
//                                 <Text variant="bodySm" as="span">
//                                     {secondPart}
//                                 </Text>
//                             </div>
//                         </div>

//                     </IndexTable.Cell>
//                     <IndexTable.Cell>
//                         <div style={{ width: '150px' }}>
//                             <TextField
//                                 type="text"
//                                 label=""
//                                 value={price}
//                                 autoComplete="off"
//                                 onChange={() => { }}
//                                 prefix={currency}
//                             />
//                         </div>
//                     </IndexTable.Cell>
//                     <IndexTable.Cell>
//                         <TextField
//                             type="number"
//                             value={String(quantity)}
//                             autoComplete="off"
//                             label=""
//                             min={0}
//                             max={9999}
//                             step={1}
//                             onChange={(newQty) => {
//                                 updateVariantQuantity(id, Number(newQty));
//                             }}
//                             disabled={isShopLocationSelected ? false : true}
//                         />
//                     </IndexTable.Cell>
//                 </IndexTable.Row>
//             );
//         }
//     );

//     return (
//         <Card padding="0">
//             <Box padding="400">
//                 <LocationSelect
//                     locations={locations}
//                     onChange={handleSelectLocation}
//                     selected={selectedLocation}
//                 />
//             </Box>
//             <IndexTable
//                 resourceName={resourceName}
//                 itemCount={variantList.length}
//                 selectable={false}
//                 headings={[
//                     { title: 'Variant' },
//                     { title: 'Price' },
//                     { title: 'Available' }
//                 ]}
//             >
//                 {rowMarkup}
//             </IndexTable>
//             {visibleCount < maxCount && (
//                 <div style={{ padding: '15px', textAlign: 'center' }}>
//                     <Button onClick={handleSeeMore}>See more</Button>
//                 </div>
//             )}
//         </Card>
//     );
// }

// export default VariantsTable;
