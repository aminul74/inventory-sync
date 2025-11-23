<?php

namespace App\Services;

use App\Models\GoogleSheet;
use Illuminate\Support\Facades\Auth;

class SheetImportService
{
    public function __construct(
        private GoogleSheetsService $googleSheetsService,
        private SingleProductService $productService
    ) {}

    public function importFromSheet(): array
    {
        $user = Auth::user();
        $sheet = GoogleSheet::where('user_id', $user->id)->first();

        if (!$sheet) {
            return ['success' => false, 'error' => 'No sheet connected'];
        }

        $data = $this->googleSheetsService->getSheetData($sheet->sheet_id, 'Products!A:Z', $user->id);

        if (!$data || count($data) < 2) {
            return ['success' => false, 'error' => 'No data found in sheet'];
        }

        $headers = array_shift($data);
        $updates = [];
        $existingVariantIds = $this->getExistingVariantIds();

        foreach ($data as $row) {
            $rowData = array_combine($headers, array_pad($row, count($headers), ''));

            if (!empty($rowData['Variant id'])) {
                if (in_array($rowData['Variant id'], $existingVariantIds)) {
                    continue;
                }

                $updates[] = [
                    'id' => $rowData['Variant id'],
                    'price' => $rowData['Price'] ?? null,
                    'inventoryQuantity' => $rowData['Inventory quantity'] ?? null,
                    'sku' => $rowData['Variant SKU'] ?? null,
                    'barcode' => $rowData['Barcode'] ?? null,
                ];
            }
        }

        if (empty($updates)) {
            return ['success' => false, 'error' => 'No new products to import'];
        }

        $result = $this->productService->updateProductVariants($updates);

        if ($result['success']) {
            $sheet->update(['sync_at' => now()]);
        }

        return $result;
    }

    private function getExistingVariantIds(): array
    {
        $productsService = app(ProductsService::class);
        $allProducts = [];
        $after = null;

        do {
            $result = $productsService->getProducts(null, $after);
            if (!empty($result['products'])) {
                $allProducts = array_merge($allProducts, $result['products']);
            }
            $after = $result['pageInfo']['hasNextPage'] ?? false ? ($result['pageInfo']['endCursor'] ?? null) : null;
        } while ($after);

        $variantIds = [];
        foreach ($allProducts as $product) {
            foreach ($product['variants'] ?? [] as $variant) {
                if (!empty($variant['id'])) {
                    $variantIds[] = $variant['id'];
                }
            }
        }

        return $variantIds;
    }
}
