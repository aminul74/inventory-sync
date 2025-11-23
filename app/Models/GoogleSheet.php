<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class GoogleSheet extends Model
{
    protected $fillable = [
        'user_id',
        'url',
        'sheet_id',
        'type',
        'sheet_created_by',
        'meta',
        'sync_at',
    ];

    protected $casts = [
        'meta' => 'array',
        'sync_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function properties(): HasOne
    {
        return $this->hasOne(GoogleSheetProperty::class);
    }
}
