import React, { useState, useEffect } from "react";
import { Card, Box, Text } from "@shopify/polaris";
import Connection from "./setup/Connection";
import SpreadsheetSetup from "./setup/SpreadsheetSetup";
import ExportConfig from "./setup/ExportConfig";
import AppsScriptSetup from "./setup/AppsScriptSetup";
import Done from "./setup/Done";

interface SetupData {
    connectionStatus?: string;
    spreadsheetId?: string;
    exportConfig?: Record<string, any>;
    appsScriptStatus?: string;
}

// Simple step indicator component
const StepIndicator: React.FC<{ currentStep: number; totalSteps: number }> = ({
    currentStep,
}) => {
    const steps = [
        { number: 1, label: "Connection", completed: currentStep > 1 },
        { number: 2, label: "Spreadsheet", completed: currentStep > 2 },
        { number: 3, label: "Export", completed: currentStep > 3 },
        { number: 4, label: "Apps Script", completed: currentStep > 4 },
        { number: 5, label: "Done", completed: currentStep > 5 },
    ];

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "16px",
            }}
        >
            {steps.map((step, index) => (
                <React.Fragment key={step.number}>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "8px",
                        }}
                    >
                        <div
                            style={{
                                width: "48px",
                                height: "48px",
                                borderRadius: "50%",
                                background:
                                    step.completed ||
                                    step.number === currentStep
                                        ? "#5b21b6"
                                        : "#e0e0e0",
                                color: "white",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: "bold",
                                border:
                                    step.number === currentStep
                                        ? "2px solid #5b21b6"
                                        : "none",
                            }}
                        >
                            {step.completed ? "✓" : step.number}
                        </div>
                        <Text variant="bodySm" as="p" alignment="center">
                            {step.label}
                        </Text>
                    </div>
                    {index < steps.length - 1 && (
                        <div
                            style={{
                                flex: 1,
                                height: "2px",
                                background: step.completed
                                    ? "#5b21b6"
                                    : "#e0e0e0",
                                minWidth: "32px",
                            }}
                        />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

const Setup: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [setupData, setSetupData] = useState<SetupData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch initial setup data on mount
    useEffect(() => {
        const fetchSetupData = async () => {
            try {
                setLoading(true);
                const response = await fetch("/api/google/user-info");
                if (!response.ok) {
                    // If fetch fails, set empty setup data to show Connect component
                    setSetupData({ connectionStatus: "disconnected" });
                    setLoading(false);
                    return;
                }
                const data = await response.json();
                // Always set data, even if not connected
                setSetupData(data);
            } catch (err) {
                // Don't show error for missing Google info, just show Connect component
                console.log("No Google info found, showing Connect component");
                setSetupData({ connectionStatus: "disconnected" });
            } finally {
                setLoading(false);
            }
        };
        fetchSetupData();
    }, []);

    const handleNext = () => setCurrentStep(currentStep + 1);
    const handleBack = () => currentStep > 1 && setCurrentStep(currentStep - 1);
    const handleFinish = () => (window.location.href = "/dashboard");

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <Connection onNext={handleNext} setupData={setupData} />;
            case 2:
                return (
                    <SpreadsheetSetup
                        onNext={handleNext}
                        onBack={handleBack}
                        setupData={setupData}
                    />
                );
            case 3:
                return (
                    <ExportConfig
                        onNext={handleNext}
                        onBack={handleBack}
                        setupData={setupData}
                    />
                );
            case 4:
                return (
                    <AppsScriptSetup
                        onNext={handleNext}
                        onBack={handleBack}
                        setupData={setupData}
                    />
                );
            case 5:
                return <Done onFinish={handleFinish} />;
            default:
                return <Connection onNext={handleNext} setupData={setupData} />;
        }
    };

    if (loading) {
        return (
            <Box>
                <div
                    style={{
                        padding: "16px",
                        minHeight: "100vh",
                        textAlign: "center",
                    }}
                >
                    <Text as="p">Loading setup...</Text>
                </div>
            </Box>
        );
    }

    if (error) {
        return (
            <Box>
                <div style={{ padding: "16px", minHeight: "100vh" }}>
                    <Card>
                        <Box padding="400">
                            <Text as="p" tone="critical">
                                {error}
                            </Text>
                        </Box>
                    </Card>
                </div>
            </Box>
        );
    }

    return (
        <Box>
            <div
                style={{
                    padding: "16px",
                    background: "#f9fafb",
                    minHeight: "100vh",
                }}
            >
                <div
                    style={{
                        maxWidth: "1200px",
                        margin: "0 auto",
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                    }}
                >
                    <Card>
                        <Box padding="400">
                            <StepIndicator
                                currentStep={currentStep}
                                totalSteps={5}
                            />
                        </Box>
                    </Card>
                    <div style={{ width: "100%" }}>{renderStep()}</div>
                </div>
            </div>
        </Box>
    );
};

export default Setup;
