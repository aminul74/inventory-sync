import React, { useState, useEffect } from "react";
import {
    Button,
    Card,
    Text,
    Box,
    BlockStack,
    Divider,
    Banner,
} from "@shopify/polaris";
import { fetchProfile } from "../../services/api";

interface DoneProps {
    onFinish: () => void;
}

const Done: React.FC<DoneProps> = ({ onFinish }) => {
    const [sheetUrl, setSheetUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadSheetUrl();
    }, []);

    const loadSheetUrl = async () => {
        try {
            const result = await fetchProfile();
            if (result.success && result.data?.profile?.sheet?.url) {
                setSheetUrl(result.data.profile.sheet.url);
            }
        } catch (err) {
            console.error("Failed to load sheet URL");
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewSheet = () => {
        if (sheetUrl) {
            window.open(sheetUrl, "_blank");
        }
    };

    return (
        <Card>
            <Box padding="400">
                <BlockStack gap="600">
                    <Box>
                        <div style={{ textAlign: "center" }}>
                            <Text variant="headingXl" as="h2">
                                Setup Complete!
                            </Text>
                        </div>
                    </Box>

                    <Divider />

                    <Banner tone="success">
                        Your Google Sheet is successfully connected. You can now
                        manage product inventory sync.
                    </Banner>

                    <Box>
                        <div style={{ textAlign: "center" }}>
                            <Text as="p" tone="subdued">
                                Your setup is complete. You can now export,
                                import, and sync products between Shopify and
                                Google Sheets.
                            </Text>
                        </div>
                    </Box>

                    <Box>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: "16px",
                                padding: "32px 0",
                            }}
                        >
                            <div
                                style={{
                                    width: "60px",
                                    height: "60px",
                                    background: "#9dd7f7",
                                    borderRadius: "8px",
                                }}
                            />
                            <div
                                style={{
                                    width: "100px",
                                    height: "8px",
                                    background: "#c9e0ed",
                                    borderRadius: "4px",
                                }}
                            />
                        </div>
                        <div
                            style={{
                                marginTop: "16px",
                                textAlign: "center",
                            }}
                        >
                            <div
                                style={{
                                    width: "60px",
                                    height: "60px",
                                    background: "#76c9f5",
                                    borderRadius: "8px",
                                    margin: "0 auto 16px",
                                }}
                            />
                            <div
                                style={{
                                    width: "100px",
                                    height: "8px",
                                    background: "#c9e0ed",
                                    borderRadius: "4px",
                                    margin: "0 auto",
                                }}
                            />
                        </div>
                    </Box>

                    <Divider />

                    <Box>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                gap: "12px",
                            }}
                        >
                            <Button
                                variant="secondary"
                                onClick={() => (window.location.href = "/")}
                            >
                                Go to Dashboard
                            </Button>
                            {sheetUrl && (
                                <Button
                                    variant="primary"
                                    onClick={handleViewSheet}
                                    disabled={isLoading}
                                >
                                    View Google Sheet
                                </Button>
                            )}
                        </div>
                    </Box>
                </BlockStack>
            </Box>
        </Card>
    );
};

export default Done;
