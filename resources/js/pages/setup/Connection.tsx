import React, { useState } from "react";
import {
    Button,
    Card,
    Text,
    Box,
    InlineStack,
    BlockStack,
    Avatar,
    Badge,
    Divider,
    Spinner,
    Banner,
} from "@shopify/polaris";
import { ArrowRightIcon } from "@shopify/polaris-icons";
import { useGoogleAuth } from "../../context/GoogleAuthContext";

interface SetupData {
    connectionStatus?: string;
    spreadsheetId?: string;
    exportConfig?: Record<string, any>;
    appsScriptStatus?: string;
}

const Connection: React.FC<{
    onNext: () => void;
    setupData?: SetupData | null;
}> = ({ onNext, setupData }) => {
    const { googleUser, isConnected, isLoading, error } = useGoogleAuth();
    const [isConnecting, setIsConnecting] = useState(false);

    console.log("GOOGLE USER ::", googleUser);

    const handleConnect = async () => {
        try {
            setIsConnecting(true);
            const response = await fetch("/auth/google");
            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsConnecting(false);
        }
    };

    if (isLoading) {
        return (
            <Card>
                <Box padding="400">
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            minHeight: "300px",
                        }}
                    >
                        <Spinner accessibilityLabel="Loading Google account information" />
                    </div>
                </Box>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <Box padding="400">
                    <Banner tone="critical" title="Error">
                        <Text as="p">{error}</Text>
                    </Banner>
                </Box>
            </Card>
        );
    }

    if (isConnected && googleUser) {
        return (
            <Card>
                <Box padding="400">
                    <BlockStack gap="400">
                        <Box>
                            <InlineStack
                                align="space-between"
                                blockAlign="center"
                            >
                                <Text variant="headingLg" as="h2">
                                    Connect your Google Account.
                                </Text>
                                <Badge tone="success">Connected</Badge>
                            </InlineStack>
                        </Box>

                        <Divider />

                        <Box>
                            <InlineStack gap="400" blockAlign="center">
                                {googleUser.picture && (
                                    <Avatar
                                        customer
                                        size="lg"
                                        source={googleUser.picture}
                                        initials={
                                            googleUser.name
                                                ?.split(" ")
                                                .map((n) => n[0])
                                                .join("") || "G"
                                        }
                                    />
                                )}
                                <BlockStack gap="100">
                                    <Text
                                        as="p"
                                        variant="bodyMd"
                                        fontWeight="bold"
                                    >
                                        {googleUser.name || googleUser.email}
                                    </Text>
                                    <Text
                                        as="p"
                                        variant="bodySm"
                                        tone="subdued"
                                    >
                                        {googleUser.email}
                                    </Text>
                                </BlockStack>
                            </InlineStack>
                        </Box>

                        <Divider />

                        <Box padding="400">
                            <div style={{ textAlign: "center" }}>
                                <Button
                                    variant="primary"
                                    onClick={onNext}
                                    icon={ArrowRightIcon}
                                >
                                    Next
                                </Button>
                            </div>
                        </Box>
                    </BlockStack>
                </Box>
            </Card>
        );
    }

    return (
        <Card>
            <Box padding="400">
                <BlockStack gap="400">
                    <Box>
                        <div style={{ textAlign: "center" }}>
                            <Text variant="headingLg" as="h2">
                                Connect your Google Account.
                            </Text>
                            <Text as="p" tone="subdued">
                                No account connected
                            </Text>
                        </div>
                    </Box>

                    <Box>
                        <div
                            style={{
                                textAlign: "center",
                                padding: "32px 0",
                            }}
                        >
                            <img
                                src="/images/google-connect.svg"
                                alt="Connect Google Account"
                                style={{
                                    maxWidth: "300px",
                                    width: "100%",
                                    margin: "0 auto",
                                }}
                            />
                        </div>
                    </Box>

                    <Box>
                        <div style={{ textAlign: "center" }}>
                            <Text as="p">
                                Let's connect your Gmail account with our App.
                            </Text>
                        </div>
                    </Box>

                    <Box padding="400">
                        <div style={{ textAlign: "center" }}>
                            <Button
                                variant="primary"
                                onClick={handleConnect}
                                loading={isConnecting}
                                size="large"
                            >
                                + Connect Google Account
                            </Button>
                        </div>
                    </Box>
                </BlockStack>
            </Box>
        </Card>
    );
};

export default Connection;
