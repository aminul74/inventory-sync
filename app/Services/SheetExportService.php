<?php

namespace App\Services;

use App\Models\GoogleSheet;
use Illuminate\Support\Facades\Auth;

class SheetExportService
{
    public function __construct(
        private GoogleSheetsService $googleSheetsService,
        private ProductsService $productsService
    ) {}

    public function exportProducts(array $fields = null): array
    {
        $user = Auth::user();
        $sheet = GoogleSheet::where('user_id', $user->id)->first();

        if (!$sheet) {
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

        $allProducts = $this->fetchAllProducts();
        $rows = $this->formatProductsForExport($allProducts, $selectedFields);

        array_unshift($rows, $selectedFields);

        $range = 'Products!A1';
        $this->googleSheetsService->clearSheet($sheet->sheet_id, 'Products!A:Z', $user->id);
        $success = $this->googleSheetsService->updateSheet($sheet->sheet_id, $range, $rows, $user->id);

        if ($success) {
            $sheet->update(['sync_at' => now()]);
            return ['success' => true, 'message' => 'Products exported successfully'];
        }

        return ['success' => false, 'error' => 'Failed to export products'];
    }

    private function fetchAllProducts(): array
    {
        $allProducts = [];
        $after = null;

        do {
            $result = $this->productsService->getProducts(null, $after);
            if (!empty($result['products'])) {
                $allProducts = array_merge($allProducts, $result['products']);
            }
            $after = $result['pageInfo']['hasNextPage'] ?? false ? ($result['pageInfo']['endCursor'] ?? null) : null;
        } while ($after);

        return $allProducts;
    }

    private function formatProductsForExport(array $products, array $fields): array
    {
        $rows = [];

        foreach ($products as $product) {
            foreach ($product['variants'] ?? [] as $variant) {
                $row = [];
                foreach ($fields as $field) {
                    $row[] = match ($field) {
                        'Product id' => $product['id'] ?? '',
                        'Variant id' => $variant['id'] ?? '',
                        'Title' => $product['title'] ?? '',
                        'Variant SKU' => $variant['sku'] ?? '',
                        'Price' => $variant['price'] ?? '',
                        'Inventory quantity' => $variant['inventoryQuantity'] ?? 0,
                        'On hand' => $variant['inventoryQuantity'] ?? 0,
                        'Available' => $variant['availableForSale'] ?? false ? 'Yes' : 'No',
                        'Barcode' => $variant['barcode'] ?? '',
                        'Vendor' => $product['vendor'] ?? '',
                        'Status' => $product['status'] ?? '',
                        'Tags' => implode(', ', $product['tags'] ?? []),
                        default => '',
                    };
                }
                $rows[] = $row;
            }
        }

        return $rows;
    }
}
