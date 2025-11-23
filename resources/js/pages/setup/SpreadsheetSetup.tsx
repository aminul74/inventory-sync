import React, { useState } from "react";
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
} from "@shopify/polaris";
import { ArrowRightIcon } from "@shopify/polaris-icons";

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
    const [setupType, setSetupType] = useState<"create" | "existing">("create");
    const [spreadsheetUrl, setSpreadsheetUrl] = useState("");
    const [sheetTitle, setSheetTitle] = useState("Sheet1");
    const [isSaving, setIsSaving] = useState(false);

    const handleContinue = async () => {
        setIsSaving(true);
        try {
            const response = await fetch("/api/setup/spreadsheet", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    setup_type: setupType,
                    spreadsheet_url: spreadsheetUrl,
                    sheet_title: sheetTitle,
                }),
            });

            if (response.ok) {
                onNext();
            }
        } catch (error) {
            console.error("Failed to setup spreadsheet:", error);
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
                            Choose Spreadsheet Setup
                        </Text>
                    </Box>

                    <Divider />

                    <FormLayout>
                        <Box padding="200">
                            <InlineStack gap="300" align="start">
                                <RadioButton
                                    label="App Generated Spreadsheet"
                                    id="create"
                                    checked={setupType === "create"}
                                    onChange={() => setSetupType("create")}
                                />
                                <Box>
                                    <Text
                                        as="p"
                                        tone="subdued"
                                        variant="bodySm"
                                    >
                                        Automatically create a new Google
                                        Spreadsheet for you.
                                    </Text>
                                </Box>
                            </InlineStack>
                        </Box>

                        <Box padding="200">
                            <InlineStack gap="300" align="start">
                                <RadioButton
                                    label="Use an Existing Spreadsheet"
                                    id="existing"
                                    checked={setupType === "existing"}
                                    onChange={() => setSetupType("existing")}
                                />
                                <Box>
                                    <Text
                                        as="p"
                                        tone="subdued"
                                        variant="bodySm"
                                    >
                                        Link an existing spreadsheet by
                                        providing its details.
                                    </Text>
                                </Box>
                            </InlineStack>
                        </Box>
                    </FormLayout>

                    {setupType === "existing" && (
                        <FormLayout>
                            <TextField
                                label="Spreadsheet url"
                                placeholder="Paste the URL of the Google Spreadsheet."
                                value={spreadsheetUrl}
                                onChange={setSpreadsheetUrl}
                                autoComplete="off"
                            />
                        </FormLayout>
                    )}

                    <FormLayout>
                        <TextField
                            label="Sheet title"
                            placeholder="Sheet1"
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
                                Create & Continue
                            </Button>
                        </div>
                    </Box>
                </BlockStack>
            </Box>
        </Card>
    );
};

export default SpreadsheetSetup;
