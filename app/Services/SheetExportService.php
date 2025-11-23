<?php

namespace App\Services;

use App\Models\GoogleSheet;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class SheetExportService
{
    public function __construct(
        private GoogleSheetsService $googleSheetsService,
        private ProductsService $productsService
    ) {}

    public function exportProducts(array $fields = null): array
    {
        $user = Auth::user();
        Log::info('SheetExportService: Starting export', ['user_id' => $user->id]);

        $sheet = GoogleSheet::where('user_id', $user->id)->first();

        if (!$sheet) {
            Log::error('SheetExportService: No sheet connected', ['user_id' => $user->id]);
            return ['success' => false, 'error' => 'No sheet connected'];
        }

        $defaultFields = [
            'Product id',
            'Variant id',
            'Title',
            'Variant SKU',
            'Price',
            'Inventory quantity',
            'On hand',
            'Available',
            'Barcode',
            'Vendor',
            'Status',
            'Tags'
        ];

        $selectedFields = $fields ?? $defaultFields;

        try {
            $this->googleSheetsService->ensureProductsTabExists($sheet->sheet_id, $user->id);

            $allProducts = $this->fetchAllProducts();
            Log::info('SheetExportService: Fetched products', ['count' => count($allProducts)]);

            $rows = $this->formatProductsForExport($allProducts, $selectedFields);
            Log::info('SheetExportService: Formatted rows', ['count' => count($rows)]);

            array_unshift($rows, $selectedFields);

            $range = 'Products!A1';
            $this->googleSheetsService->clearSheet($sheet->sheet_id, 'Products!A:Z', $user->id);
            $success = $this->googleSheetsService->updateSheet($sheet->sheet_id, $range, $rows, $user->id);

            if ($success) {
                $sheet->update(['sync_at' => now()]);
                Log::info('SheetExportService: Export successful');
                return ['success' => true, 'message' => 'Products exported successfully'];
            }

            Log::error('SheetExportService: Update sheet failed');
            return ['success' => false, 'error' => 'Failed to export products'];
        } catch (\Exception $e) {
            Log::error('SheetExportService: Export exception', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return ['success' => false, 'error' => 'Failed to export products: ' . $e->getMessage()];
        }
    }

    private function fetchAllProducts(): array
    {
        $allProducts = [];
        $after = null;

        do {
            $query = $this->getExportQuery($after);
            $result = \App\Lib\ShopifyClient::queryOrException($query);

            if (!empty($result['products']['edges'])) {
                foreach ($result['products']['edges'] as $edge) {
                    $allProducts[] = $edge['node'];
                }
            }

            $hasNextPage = $result['products']['pageInfo']['hasNextPage'] ?? false;
            $after = $hasNextPage ? ($result['products']['pageInfo']['endCursor'] ?? null) : null;
        } while ($after);

        return $allProducts;
    }

    private function getExportQuery(?string $after): string
    {
        $paginationPart = $after ? 'first: 50, after: "' . $after . '"' : 'first: 50';

        return '{
            products(' . $paginationPart . ') {
                edges {
                    node {
                        id
                        title
                        vendor
                        status
                        tags
                        variants(first: 100) {
                            edges {
                                node {
                                    id
                                    sku
                                    price
                                    barcode
                                    inventoryQuantity
                                    availableForSale
                                }
                            }
                        }
                    }
                    cursor
                }
                pageInfo {
                    hasNextPage
                    endCursor
                }
            }
        }';
    }

    private function formatProductsForExport(array $products, array $fields): array
    {
        $rows = [];

        foreach ($products as $product) {
            $variants = $product['variants']['edges'] ?? [];
            Log::info('SheetExportService: Product variants', ['product_id' => $product['id'] ?? 'unknown', 'variant_count' => count($variants)]);

            foreach ($variants as $variantEdge) {
                $variant = $variantEdge['node'] ?? [];
                $row = [];
                foreach ($fields as $field) {
                    $value = match ($field) {
                        'Product id' => $product['id'] ?? 'N/A',
                        'Variant id' => $variant['id'] ?? 'N/A',
                        'Title' => $product['title'] ?? 'N/A',
                        'Variant SKU' => !empty($variant['sku']) ? $variant['sku'] : 'N/A',
                        'Price' => !empty($variant['price']) ? $variant['price'] : 'N/A',
                        'Inventory quantity' => isset($variant['inventoryQuantity']) ? (string)$variant['inventoryQuantity'] : '0',
                        'On hand' => isset($variant['inventoryQuantity']) ? (string)$variant['inventoryQuantity'] : '0',
                        'Available' => isset($variant['availableForSale']) ? ($variant['availableForSale'] ? 'Yes' : 'No') : 'N/A',
                        'Barcode' => !empty($variant['barcode']) ? $variant['barcode'] : 'N/A',
                        'Vendor' => !empty($product['vendor']) ? $product['vendor'] : 'N/A',
                        'Status' => !empty($product['status']) ? $product['status'] : 'N/A',
                        'Tags' => !empty($product['tags']) ? implode(', ', $product['tags']) : 'N/A',
                        default => 'N/A',
                    };
                    $row[] = $value;
                }
                $rows[] = $row;
            }
        }

        return $rows;
    }
}
