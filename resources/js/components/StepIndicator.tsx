import React from "react";
import { Text } from "@shopify/polaris";

interface StepIndicatorProps {
    currentStep: number;
    totalSteps: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
    currentStep,
    totalSteps,
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

export default StepIndicator;
