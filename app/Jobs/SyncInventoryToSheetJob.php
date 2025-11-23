<?php

namespace App\Jobs;

use App\Models\GoogleSheet;
use App\Services\GoogleSheetsService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SyncInventoryToSheetJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        private int $userId,
        private array $inventoryChanges
    ) {}

    public function handle(GoogleSheetsService $sheetsService): void
    {
        $sheet = GoogleSheet::where('user_id', $this->userId)->first();

        if (!$sheet) {
            return;
        }

        $data = $sheetsService->getSheetData($sheet->sheet_id, 'Products!A:Z', $this->userId);

        if (!$data || count($data) < 2) {
            return;
        }

        $headers = $data[0];
        $variantIdIndex = array_search('Variant id', $headers);
        $inventoryIndex = array_search('Inventory quantity', $headers);
        $onHandIndex = array_search('On hand', $headers);

        if ($variantIdIndex === false || $inventoryIndex === false) {
            return;
        }

        $updates = [];
        foreach ($this->inventoryChanges as $change) {
            foreach ($data as $rowIndex => $row) {
                if ($rowIndex === 0) continue;

                if (isset($row[$variantIdIndex]) && $row[$variantIdIndex] === $change['variant_id']) {
                    $data[$rowIndex][$inventoryIndex] = $change['quantity'];
                    if ($onHandIndex !== false) {
                        $data[$rowIndex][$onHandIndex] = $change['quantity'];
                    }
                    break;
                }
            }
        }

        $sheetsService->updateSheet($sheet->sheet_id, 'Products!A1', $data, $this->userId);
        $sheet->update(['sync_at' => now()]);
    }
}
