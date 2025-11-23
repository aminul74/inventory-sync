<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GoogleUserInfo extends Model
{
    protected $table = 'google_user_info';

    protected $fillable = [
        'user_id',
        'google_id',
        'email',
        'verified_email',
        'name',
        'given_name',
        'family_name',
        'picture',
        'access_token',
        'refresh_token',
        'expires_in',
        'token_expires_at',
    ];

    protected $casts = [
        'verified_email' => 'boolean',
        'expires_in' => 'integer',
        'token_expires_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
