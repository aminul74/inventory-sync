<?php

namespace App\Http\Controllers;

use App\Services\SheetService;
use App\Services\SheetExportService;
use App\Services\SheetImportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SheetController extends Controller
{
    public function __construct(
        private SheetService $sheetService,
        private SheetExportService $exportService,
        private SheetImportService $importService
    ) {}

    public function createSheet(Request $request): JsonResponse
    {
        $request->validate([
            'url' => 'required|string',
            'title' => 'required|string',
            'option' => 'required|in:manual,auto',
        ]);

        $result = $this->sheetService->createSheet(
            $request->input('url'),
            $request->input('title'),
            $request->input('option')
        );

        return response()->json($result, $result['success'] ? 200 : 400);
    }

    public function profile(): JsonResponse
    {
        $result = $this->sheetService->getProfile();
        return response()->json($result);
    }

    public function exportProducts(Request $request): JsonResponse
    {
        $fields = $request->input('fields');
        $result = $this->exportService->exportProducts($fields);
        return response()->json($result, $result['success'] ? 200 : 400);
    }

    public function importProducts(): JsonResponse
    {
        $result = $this->importService->importFromSheet();
        return response()->json($result, $result['success'] ? 200 : 400);
    }

    public function syncProducts(Request $request): JsonResponse
    {
        $result = $this->exportService->exportProducts();
        return response()->json($result, $result['success'] ? 200 : 400);
    }
}
