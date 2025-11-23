import React, { useState, useEffect } from "react";
import { Button, Card, Text, Box, BlockStack, Divider } from "@shopify/polaris";

interface DoneProps {
    onFinish: () => void;
}

const Done: React.FC<DoneProps> = ({ onFinish }) => {
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        // Simulate completion
        const timer = setTimeout(() => {
            setIsProcessing(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Card>
            <Box padding="400">
                <BlockStack gap="600">
                    <Box>
                        <div style={{ textAlign: "center" }}>
                            <Text variant="headingXl" as="h2">
                                Almost Done!
                            </Text>
                        </div>
                    </Box>

                    <Box>
                        <div style={{ textAlign: "center" }}>
                            <Text as="p" tone="subdued">
                                Your export is in progress. You can continue
                                with your tasks, and the data will be available
                                in your Google Sheet shortly. You can check the
                                final step once the process is complete.
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
                                onClick={() =>
                                    (window.location.href = "/dashboard")
                                }
                            >
                                Keep exporting & back to dashboard
                            </Button>
                            <Button variant="primary" onClick={onFinish}>
                                View on Google Sheet
                            </Button>
                        </div>
                    </Box>
                </BlockStack>
            </Box>
        </Card>
    );
};

export default Done;
