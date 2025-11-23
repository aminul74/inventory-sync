import React, { useState } from "react";
import {
    Button,
    Card,
    Text,
    Box,
    InlineStack,
    BlockStack,
    Divider,
    TextField,
    Link,
} from "@shopify/polaris";

interface SetupData {
    connectionStatus?: string;
    spreadsheetId?: string;
    exportConfig?: Record<string, any>;
    appsScriptStatus?: string;
}

interface AppsScriptSetupProps {
    onNext: () => void;
    onBack: () => void;
    setupData?: SetupData | null;
}

const AppsScriptSetup: React.FC<AppsScriptSetupProps> = ({
    onNext,
    onBack,
    setupData,
}) => {
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const scriptCode = `
function onEdit(e) {
  const range = e.range;
  const sheet = range.getSheet();
  const values = sheet.getDataRange().getValues();
  // Auto-sync logic here
}

function runSync() {
  console.log('Sync started');
  // Your sync logic
}
    `.trim();

    const handleCopy = () => {
        navigator.clipboard.writeText(scriptCode);
        alert("Apps Script code copied to clipboard!");
    };

    const handleContinue = async () => {
        setIsSaving(true);
        try {
            const response = await fetch("/api/setup/apps-script", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ confirmed: isConfirmed }),
            });

            if (response.ok) {
                onNext();
            }
        } catch (error) {
            console.error("Failed to setup apps script:", error);
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
                            Add Apps Script
                        </Text>
                    </Box>

                    <Divider />

                    <Box>
                        <div
                            style={{
                                background: "#e3f2fd",
                                borderRadius: "8px",
                                padding: "16px",
                            }}
                        >
                            <BlockStack gap="200">
                                <Text variant="headingMd" as="p">
                                    ℹ️ Set Up Real-Time Sync & Easy Automation!
                                </Text>
                                <Text as="p" variant="bodySm">
                                    Apps Script auto-syncs and styles your
                                    Sheets in real time—pretty magical, right?{" "}
                                    <Link url="#" external>
                                        Set it up
                                    </Link>
                                    . Whenever you're ready to automate product
                                    syncing and save yourself tons of time!
                                </Text>
                            </BlockStack>
                        </div>
                    </Box>

                    <Box>
                        <BlockStack gap="300">
                            <Text variant="headingMd" as="h3">
                                How to add Apps Script
                            </Text>

                            <ol
                                style={{
                                    paddingLeft: "20px",
                                    lineHeight: "1.8",
                                }}
                            >
                                <li>
                                    <Text as="p" variant="bodySm">
                                        Copy the Apps Script code below.
                                    </Text>
                                </li>
                                <li>
                                    <Text as="p" variant="bodySm">
                                        Go to your{" "}
                                        <strong>Google Sheets</strong> and click
                                        on the <strong>Extensions</strong> menu.
                                    </Text>
                                </li>
                                <li>
                                    <Text as="p" variant="bodySm">
                                        Click on <strong>Apps Script</strong>.
                                    </Text>
                                </li>
                                <li>
                                    <Text as="p" variant="bodySm">
                                        Remove any existing code and paste the
                                        code below.
                                    </Text>
                                </li>
                                <li>
                                    <Text as="p" variant="bodySm">
                                        Save the code and click{" "}
                                        <strong>Run</strong>.
                                    </Text>
                                </li>
                                <li>
                                    <Text as="p" variant="bodySm">
                                        A popup will appear asking for
                                        permission. Make sure popups are
                                        enabled.{" "}
                                        <strong>
                                            Watch the video for details 👇
                                        </strong>
                                    </Text>
                                </li>
                            </ol>
                        </BlockStack>
                    </Box>

                    <Box>
                        <div
                            style={{
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                padding: "16px",
                            }}
                        >
                            <BlockStack gap="200">
                                <InlineStack gap="200" align="space-between">
                                    <TextField
                                        type="text"
                                        label=""
                                        value={
                                            scriptCode.substring(0, 40) + "..."
                                        }
                                        disabled
                                        autoComplete="off"
                                    />
                                    <Button
                                        onClick={handleCopy}
                                        variant="secondary"
                                    >
                                        Copy Code
                                    </Button>
                                </InlineStack>

                                <div
                                    style={{
                                        width: "100%",
                                        height: "200px",
                                        background: "#f5f5f5",
                                        borderRadius: "4px",
                                        overflow: "auto",
                                        border: "1px solid #ddd",
                                        padding: "12px",
                                        fontFamily: "monospace",
                                        fontSize: "12px",
                                    }}
                                >
                                    <pre
                                        style={{
                                            margin: 0,
                                            whiteSpace: "pre-wrap",
                                            wordBreak: "break-all",
                                        }}
                                    >
                                        {scriptCode}
                                    </pre>
                                </div>

                                <img
                                    src="/images/apps-script-guide.png"
                                    alt="How to add Apps Script"
                                    style={{
                                        maxWidth: "100%",
                                        borderRadius: "4px",
                                        marginTop: "12px",
                                    }}
                                />
                            </BlockStack>
                        </div>
                    </Box>

                    <Box>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                padding: "16px",
                                background: "#f5f5f5",
                                borderRadius: "4px",
                            }}
                        >
                            <input
                                type="checkbox"
                                id="confirm"
                                checked={isConfirmed}
                                onChange={(e) =>
                                    setIsConfirmed(e.target.checked)
                                }
                                style={{ cursor: "pointer" }}
                            />
                            <label
                                htmlFor="confirm"
                                style={{ cursor: "pointer", margin: 0 }}
                            >
                                <Text as="p" variant="bodySm">
                                    I have successfully added the Apps Script to
                                    my Google Sheet
                                </Text>
                            </label>
                        </div>
                    </Box>

                    <Box>
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
                                variant="secondary"
                                onClick={() => onNext()}
                            >
                                Skip for now
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleContinue}
                                disabled={!isConfirmed}
                                loading={isSaving}
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

export default AppsScriptSetup;
