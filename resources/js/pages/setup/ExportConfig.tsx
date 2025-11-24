import React, { useState } from "react";
import {
    Button,
    Card,
    Text,
    Box,
    BlockStack,
    Divider,
    Banner,
    InlineStack,
    Spinner,
} from "@shopify/polaris";
import { ArrowRightIcon } from "@shopify/polaris-icons";
import {
    exportProducts,
    importProducts,
    syncProducts,
} from "../../services/api";

interface ExportConfigProps {
    onNext: () => void;
    onBack: () => void;
}

const ExportConfig: React.FC<ExportConfigProps> = ({ onNext, onBack }) => {
    const [isExporting, setIsExporting] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [message, setMessage] = useState<{
        type: "success" | "critical";
        text: string;
    } | null>(null);

    const handleExport = async () => {
        setIsExporting(true);
        setMessage(null);
        try {
            const result = await exportProducts();
            if (result.success) {
                setMessage({
                    type: "success",
                    text: result.message || "Products exported successfully",
                });
            } else {
                setMessage({
                    type: "critical",
                    text: result.error || "Failed to export products",
                });
            }
        } catch (err: any) {
            setMessage({
                type: "critical",
                text: err.message || "Export failed",
            });
        } finally {
            setIsExporting(false);
        }
    };

    const handleImport = async () => {
        setIsImporting(true);
        setMessage(null);
        try {
            const result = await importProducts();
            if (result.success) {
                setMessage({
                    type: "success",
                    text: result.message || "Products imported successfully",
                });
            } else {
                setMessage({
                    type: "critical",
                    text: result.error || "Failed to import products",
                });
            }
        } catch (err: any) {
            setMessage({
                type: "critical",
                text: err.message || "Import failed",
            });
        } finally {
            setIsImporting(false);
        }
    };

    const handleSync = async () => {
        setIsSyncing(true);
        setMessage(null);
        try {
            const result = await syncProducts();
            if (result.success) {
                setMessage({
                    type: "success",
                    text: result.message || "Products synced successfully",
                });
            } else {
                setMessage({
                    type: "critical",
                    text: result.error || "Failed to sync products",
                });
            }
        } catch (err: any) {
            setMessage({
                type: "critical",
                text: err.message || "Sync failed",
            });
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <Card>
            <Box padding="400">
                <BlockStack gap="400">
                    <Box>
                        <Text variant="headingLg" as="h2">
                            Manage Products
                        </Text>
                    </Box>

                    <Divider />

                    {message && (
                        <Banner
                            tone={message.type}
                            onDismiss={() => setMessage(null)}
                        >
                            {message.text}
                        </Banner>
                    )}

                    <BlockStack gap="300">
                        <Card>
                            <Box padding="400">
                                <BlockStack gap="300">
                                    <Text variant="headingMd" as="h3">
                                        Export Products
                                    </Text>
                                    <Text as="p" tone="subdued">
                                        Export all products from Shopify to the
                                        connected Google Sheet
                                    </Text>
                                    <Box>
                                        <Button
                                            onClick={handleExport}
                                            loading={isExporting}
                                            disabled={isImporting || isSyncing}
                                        >
                                            Export to Sheet
                                        </Button>
                                    </Box>
                                </BlockStack>
                            </Box>
                        </Card>

                        {/* <Card>
                            <Box padding="400">
                                <BlockStack gap="300">
                                    <Text variant="headingMd" as="h3">
                                        Import Products
                                    </Text>
                                    <Text as="p" tone="subdued">
                                        Import product updates from the Google
                                        Sheet to Shopify
                                    </Text>
                                    <Box>
                                        <Button
                                            onClick={handleImport}
                                            loading={isImporting}
                                            disabled={isExporting || isSyncing}
                                        >
                                            Import from Sheet
                                        </Button>
                                    </Box>
                                </BlockStack>
                            </Box>
                        </Card> */}

                        <Card>
                            <Box padding="400">
                                <BlockStack gap="300">
                                    <Text variant="headingMd" as="h3">
                                        Sync Products
                                    </Text>
                                    <Text as="p" tone="subdued">
                                        Sync products from Shopify to the Sheet
                                    </Text>
                                    <Box>
                                        <Button
                                            onClick={handleSync}
                                            loading={isSyncing}
                                            disabled={
                                                isExporting || isImporting
                                            }
                                        >
                                            Sync Products
                                        </Button>
                                    </Box>
                                </BlockStack>
                            </Box>
                        </Card>
                    </BlockStack>

                    <Box padding="400">
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: "8px",
                            }}
                        >
                            <Button onClick={onBack} variant="secondary">
                                Back
                            </Button>
                            <Button
                                variant="primary"
                                onClick={onNext}
                                icon={<ArrowRightIcon />}
                            >
                                Continue
                            </Button>
                        </div>
                    </Box>
                </BlockStack>
            </Box>
        </Card>
    );
};

export default ExportConfig;
