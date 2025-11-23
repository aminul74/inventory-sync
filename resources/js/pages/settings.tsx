import React, { useEffect, useState } from "react";
import {
    Page,
    Card,
    BlockStack,
    InlineGrid,
    Box,
    Text,
    TextField,
    Divider,
    useBreakpoints,
} from "@shopify/polaris";
import CustomColorPicker from "../components/CustomColorPicker";
import { useSettings } from "../hooks/useAppSettings";
import SettingsPage from "../components/Skeletons/Settings";

const Settings = () => {
    const smUp = useBreakpoints();
    const { settings, loading, updateSettings } = useSettings();

    const [alertBackgroundColor, setAlertBackgroundColor] = useState("#FFFFFF");
    const [alertTextColor, setAlertTextColor] = useState("#000000");
    const [alertText, setAlertText] = useState(
        "🚨 Low stock alert! Only {stock} left"
    );

    useEffect(() => {
        if (!loading && settings) {
            setAlertBackgroundColor(
                settings?.alertBackgroundColor || "#FFFFFF"
            );
            setAlertTextColor(settings?.alertTextColor || "#000000");
            setAlertText(
                settings?.alertText || "🚨 Low stock alert! Only {stock} left"
            );
        }
    }, [loading, settings]);

    const handleColorChange = (value: string, type: string) => {
        if (type === "background") setAlertBackgroundColor(value);
        else if (type === "textColor") setAlertTextColor(value);
    };

    const saveSettings = async () => {
        try {
            await updateSettings({
                alertBackgroundColor,
                alertTextColor,
                alertText,
            });
            shopify.toast.show("Settings updated successfully");
        } catch (err) {
            shopify.toast.show("Failed to update settings", { isError: true });
        }
    };

    if (loading) return <SettingsPage />;

    return (
        <Page
            title="Alert Style Settings"
            primaryAction={{
                content: "Save",
                onAction: saveSettings,
                type: "primary",
            }}
        >
            <BlockStack gap={{ xs: "800", sm: "400" }}>
                <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
                    <Box
                        as="section"
                        paddingInlineStart={{ xs: "400", sm: "0" }}
                        paddingInlineEnd={{ xs: "400", sm: "0" }}
                    >
                        <BlockStack gap="400">
                            <Text as="h3" variant="headingMd">
                                Background Color
                            </Text>
                            <Text as="p" variant="bodyMd">
                                This background color will be used for the alert
                                on storefront.
                            </Text>
                        </BlockStack>
                    </Box>
                    <Card roundedAbove="sm">
                        <BlockStack gap="400">
                            <CustomColorPicker
                                label="Select Color"
                                element="background"
                                colour={alertBackgroundColor}
                                changeColor={handleColorChange}
                            />
                        </BlockStack>
                    </Card>
                </InlineGrid>

                {smUp ? <Divider /> : null}

                <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
                    <Box
                        as="section"
                        paddingInlineStart={{ xs: "400", sm: "0" }}
                        paddingInlineEnd={{ xs: "400", sm: "0" }}
                    >
                        <BlockStack gap="400">
                            <Text as="h3" variant="headingMd">
                                Text Settings
                            </Text>
                            <Text as="p" variant="bodyMd">
                                This text will be used for the alert on
                                storefront.
                            </Text>
                        </BlockStack>
                    </Box>
                    <Card roundedAbove="sm">
                        <BlockStack gap="400">
                            <TextField
                                type="text"
                                autoComplete="off"
                                label="Alert Text"
                                value={alertText}
                                onChange={setAlertText}
                                multiline={4}
                            />
                            <CustomColorPicker
                                label="Select Color"
                                element="textColor"
                                colour={alertTextColor}
                                changeColor={handleColorChange}
                            />
                        </BlockStack>
                    </Card>
                </InlineGrid>
            </BlockStack>
        </Page>
    );
};

export default Settings;
