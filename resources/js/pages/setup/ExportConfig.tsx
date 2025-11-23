import React, { useState } from "react";
import {
    Button,
    Card,
    Text,
    Box,
    InlineStack,
    BlockStack,
    Badge,
    Icon,
    Divider,
} from "@shopify/polaris";
import { DragHandleIcon, DeleteIcon } from "@shopify/polaris-icons";

interface SetupData {
    connectionStatus?: string;
    spreadsheetId?: string;
    exportConfig?: Record<string, any>;
    appsScriptStatus?: string;
}

interface ExportConfigProps {
    onNext: () => void;
    onBack: () => void;
    setupData?: SetupData | null;
}

const ExportConfig: React.FC<ExportConfigProps> = ({
    onNext,
    onBack,
    setupData,
}) => {
    const [selectedColumns, setSelectedColumns] = useState<string[]>([
        "product_id",
        "variant_id",
        "inventory_item_id",
        "location_id",
        "category_name",
        "category_full_name",
        "vendor",
    ]);
    const [isSaving, setIsSaving] = useState(false);

    const allColumns = [
        { id: "product_id", label: "Product ID", required: true },
        { id: "variant_id", label: "Variant ID", required: true },
        { id: "inventory_item_id", label: "Inventory Item ID", required: true },
        { id: "location_id", label: "Location ID", required: true },
        { id: "category_name", label: "Category Name", required: false },
        {
            id: "category_full_name",
            label: "Category Full Name",
            required: false,
        },
        { id: "vendor", label: "Vendor", required: false },
    ];

    const handleSelectColumn = (columnId: string) => {
        if (!selectedColumns.includes(columnId)) {
            setSelectedColumns([...selectedColumns, columnId]);
        }
    };

    const handleRemoveColumn = (columnId: string) => {
        setSelectedColumns(selectedColumns.filter((id) => id !== columnId));
    };

    const handleSelectAll = () => {
        setSelectedColumns(allColumns.map((c) => c.id));
    };

    const handleClearAll = () => {
        setSelectedColumns([]);
    };

    const handleContinue = async () => {
        setIsSaving(true);
        try {
            const response = await fetch("/api/setup/export-config", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    columns: selectedColumns,
                }),
            });

            if (response.ok) {
                onNext();
            }
        } catch (error) {
            console.error("Failed to save export config:", error);
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
                            Export Data to Google Sheets
                        </Text>
                        <Text as="p" tone="subdued">
                            Configure which columns to include in your export
                        </Text>
                    </Box>

                    <Divider />

                    <Box>
                        <Text variant="headingMd" as="h3">
                            Available Columns
                        </Text>
                        <InlineStack gap="200">
                            <Button
                                variant="secondary"
                                onClick={handleSelectAll}
                            >
                                Select All
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={handleClearAll}
                            >
                                Clear All
                            </Button>
                        </InlineStack>
                    </Box>

                    <BlockStack gap="200">
                        {allColumns.map((column) => (
                            <div
                                key={column.id}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                    padding: "12px",
                                    border: "1px solid #e1e4e8",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                }}
                                onClick={() => {
                                    if (selectedColumns.includes(column.id)) {
                                        handleRemoveColumn(column.id);
                                    } else {
                                        handleSelectColumn(column.id);
                                    }
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedColumns.includes(
                                        column.id
                                    )}
                                    readOnly
                                    style={{ cursor: "pointer" }}
                                />
                                <Box>
                                    <Text as="p" variant="bodySm">
                                        {column.label}
                                    </Text>
                                </Box>
                                {column.required && (
                                    <Badge tone="info">Required</Badge>
                                )}
                            </div>
                        ))}
                    </BlockStack>

                    <Box>
                        <Text variant="headingMd" as="h3">
                            Column Order ({selectedColumns.length} selected)
                        </Text>
                        <Text as="p" tone="subdued">
                            Your selected columns will be exported in this
                            order:
                        </Text>
                    </Box>

                    <BlockStack gap="200">
                        {selectedColumns.map((columnId, index) => {
                            const column = allColumns.find(
                                (c) => c.id === columnId
                            );
                            return column ? (
                                <div
                                    key={columnId}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "12px",
                                        padding: "12px",
                                        background: "#f5f5f5",
                                        borderRadius: "4px",
                                    }}
                                >
                                    <Icon source={DragHandleIcon} />
                                    <Text as="p" variant="bodySm">
                                        {index + 1}. {column.label}
                                    </Text>
                                    {column.required && (
                                        <Badge tone="success">Required</Badge>
                                    )}
                                    <Button
                                        variant="tertiary"
                                        size="slim"
                                        onClick={() =>
                                            handleRemoveColumn(columnId)
                                        }
                                        icon={DeleteIcon}
                                    />
                                </div>
                            ) : null;
                        })}
                    </BlockStack>

                    <Box>
                        <div
                            style={{
                                padding: "16px",
                                background: "#f0f7ff",
                                borderRadius: "4px",
                                border: "1px solid #c3e1f8",
                            }}
                        >
                            <Text as="p" variant="bodySm">
                                <strong>Export Preview:</strong>{" "}
                                {selectedColumns
                                    .slice(0, 3)
                                    .map(
                                        (id) =>
                                            allColumns.find((c) => c.id === id)
                                                ?.label
                                    )
                                    .filter(Boolean)
                                    .join(", ")}
                                {selectedColumns.length > 3
                                    ? ` + ${selectedColumns.length - 3} more`
                                    : ""}
                            </Text>
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
                                variant="primary"
                                onClick={handleContinue}
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

export default ExportConfig;
