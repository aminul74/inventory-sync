// import { Badge, Box, Card, Layout, Page, Select, TextField } from "@shopify/polaris";
// import React, { useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { useProduct } from "../../hooks/useProduct";
// import ErrorPage from "../../components/Error";
// import ProductDetailsPage from "../../components/Skeletons/Page";
// import { capitalizeFirstLetter } from "../../utils/formatters";
// import VariantsTable from "../../components/Products/VariantsTable";
// import { SaveBar, useAppBridge } from '@shopify/app-bridge-react';
// import { useVariantStockUpdate } from "../../hooks/useUpdateVariantsStock";

// type RouteParams = {
//     id?: string;
// };

// type Props = {
//     id?: string;
// };

// type ProductVariant = {
//     id: string;
//     displayName: string;
//     image: string;
//     price: string;
//     quantity: number;
//     title: string;
// };

// const PRODUCT_STATUS: Record<string, "success" | "info" | "critical"> = {
//     ACTIVE: "success",
//     DRAFT: "info"
// };

// const EditProductVariantsQuantity: React.FC<Props> = ({ id }) => {
//     const shopify = useAppBridge();
//     const nagivate = useNavigate();
//     const params = useParams<RouteParams>();
//     const resolvedProductId = id || params.id;
//     const [variantsChanged, setVariantsChanged] = useState(false);
//     const [updatedVariants, setUpdatedVariants] = useState<ProductVariant[]>([]);

//     const { product, loading, error } = useProduct(resolvedProductId);
//     const { updateStock, loading: stockUpdateLoading, error: stockUpdateError } = useVariantStockUpdate();

//     if (loading) {
//         return <ProductDetailsPage />;
//     }

//     if (error) {
//         return <ErrorPage errorMessage={error} />;
//     }

//     const getProductStatus = (status: string) => {
//         const tone = PRODUCT_STATUS[status];
//         if (!tone) return null;
//         return <Badge tone={tone}>{capitalizeFirstLetter(status)}</Badge>;
//     };

//     const statusOptions = Object.keys(PRODUCT_STATUS).map((status) => ({
//         label: capitalizeFirstLetter(status),
//         value: status,
//     }));

//     const handleVariantsUpdate = (updatedList: ProductVariant[]) => {
//         const updatedWithProductId = updatedList.map(variant => ({
//             ...variant,
//             productId: "gid://shopify/Product/" + resolvedProductId
//         }));
//         setUpdatedVariants(updatedWithProductId);
//     };

//     const handleSave = async () => {
//         try {
//             await updateStock(updatedVariants);
//             shopify.toast.show('Variants updated successfully');
//           } catch (err) {
//             console.error("Update failed");
//             shopify.toast.show('Failed to update variants', { isError: true });
//           }
//         shopify.saveBar.hide('save-bar');
//         setVariantsChanged(false);
//     };

//     const handleDiscard = () => {
//         shopify.saveBar.hide('save-bar');
//         setVariantsChanged(false);
//     };

//     return (
//         <Page
//             backAction={{ content: 'Products', onAction: () => nagivate("/") }}
//             title={product?.title}
//             titleMetadata={getProductStatus(product?.status)}
//             primaryAction={{ content: 'Save', disabled: true }}
//         >
//             <Layout>
//                 <Layout.Section>
//                     <Card>
//                         <TextField
//                             label="Title"
//                             value={product?.title}
//                             autoComplete="off"
//                             onChange={() => { }}
//                         />
//                     </Card>
//                     <Box paddingBlockStart="400">
//                         <VariantsTable
//                             currency={product?.currency ?? ''}
//                             variants={(product?.variants ?? []) as ProductVariant[]}
//                             locations={product?.locations ?? []}
//                             onQuantityChange={(hasChanged: boolean) => setVariantsChanged(hasChanged)}
//                             onVariantsUpdate={handleVariantsUpdate}
//                         />
//                     </Box>
//                 </Layout.Section>
//                 <Layout.Section variant="oneThird">
//                     <Card>
//                         <Select
//                             label="Status"
//                             options={statusOptions}
//                             value={capitalizeFirstLetter(product?.status)}
//                             onChange={() => { }}
//                         />
//                     </Card>
//                 </Layout.Section>

//                 <SaveBar id="save-bar" open={variantsChanged}>
//                     <button variant="primary" onClick={handleSave}></button>
//                     <button onClick={handleDiscard}></button>
//                 </SaveBar>

//             </Layout>
//         </Page>
//     );
// }

// export default EditProductVariantsQuantity;
