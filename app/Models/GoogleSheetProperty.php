<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GoogleSheetProperty extends Model
{
    protected $fillable = [
        'google_sheet_id',
        'properties',
    ];

    protected $casts = [
        'properties' => 'array',
    ];

    public function googleSheet(): BelongsTo
    {
        return $this->belongsTo(GoogleSheet::class);
    }
}
