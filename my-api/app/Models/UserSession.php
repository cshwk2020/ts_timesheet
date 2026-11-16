<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserSession extends Model {
    protected $fillable = [
        'user_id', 
        'token_hash', 
        'logon_at', 
        'expires_at'
    ];

    protected $casts = [
        'logon_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    public function user(): BelongsTo {
        return $this->belongsTo(User::class);
    }
}
