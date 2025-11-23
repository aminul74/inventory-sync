import React, { useState, useEffect } from "react";
import {
    Button,
    Card,
    Text,
    Box,
    InlineStack,
    BlockStack,
    TextField,
    RadioButton,
    FormLayout,
    Divider,
    Banner,
} from "@shopify/polaris";
import { ArrowRightIcon } from "@shopify/polaris-icons";
import { createSheet, fetchProfile } from "../../services/api";

interface SetupData {
    connectionStatus?: string;
    spreadsheetId?: string;
    exportConfig?: Record<string, any>;
    appsScriptStatus?: string;
}

interface SpreadsheetSetupProps {
    onNext: () => void;
    onBack: () => void;
    setupData?: SetupData | null;
}

const SpreadsheetSetup: React.FC<SpreadsheetSetupProps> = ({
    onNext,
    onBack,
    setupData,
}) => {
    const [setupType, setSetupType] = useState<"manual">("manual");
    const [spreadsheetUrl, setSpreadsheetUrl] = useState("");
    const [sheetTitle, setSheetTitle] = useState("Products");
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [existingSheet, setExistingSheet] = useState<any>(null);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const result = await fetchProfile();
            if (result.success && result.data?.profile?.sheet) {
                setExistingSheet(result.data.profile.sheet);
                setSpreadsheetUrl(result.data.profile.sheet.url);
            }
        } catch (err) {
            console.error("Failed to load profile");
        }
    };

    const handleContinue = async () => {
        if (!spreadsheetUrl.trim()) {
            setError("Please enter a spreadsheet URL");
            return;
        }

        setIsSaving(true);
        setError(null);

        try {
            const result = await createSheet({
                url: spreadsheetUrl,
                title: sheetTitle,
                option: setupType,
            });

            if (result.success) {
                onNext();
            } else {
                setError(result.error || "Failed to create sheet");
            }
        } catch (err: any) {
            setError(err.message || "Failed to setup spreadsheet");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Card>
            <Box padding="400">
                <BlockStack gap="400">
                    <Box>
                        <Text variant="headingLg" as="h2">
                            Connect Spreadsheet
                        </Text>
                    </Box>

                    <Divider />

                    {error && (
                        <Banner
                            tone="critical"
                            onDismiss={() => setError(null)}
                        >
                            {error}
                        </Banner>
                    )}

                    {existingSheet && (
                        <Banner tone="info">
                            Sheet already connected: {existingSheet.url}
                        </Banner>
                    )}

                    <FormLayout>
                        <TextField
                            label="Spreadsheet URL"
                            placeholder="Paste the URL of the Google Spreadsheet"
                            value={spreadsheetUrl}
                            onChange={setSpreadsheetUrl}
                            autoComplete="off"
                        />
                    </FormLayout>

                    <FormLayout>
                        <TextField
                            label="Sheet Title"
                            placeholder="Products"
                            value={sheetTitle}
                            onChange={setSheetTitle}
                            autoComplete="off"
                        />
                    </FormLayout>

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
                                onClick={handleContinue}
                                loading={isSaving}
                                icon={<ArrowRightIcon />}
                            >
                                Connect & Continue
                            </Button>
                        </div>
                    </Box>
                </BlockStack>
            </Box>
        </Card>
    );
};

export default SpreadsheetSetup;
