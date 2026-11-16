<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TimesheetRecord extends Model {
    protected $fillable = [
        'user_id', 
        'task_id', 
        'from_date_time', 
        'to_date_time', 
        'remark', 
        'last_updated_at'
    ];

    protected $casts = [
        'from_date_time' => 'datetime',
        'to_date_time' => 'datetime',
        'last_updated_at' => 'datetime',
    ];

    public function user(): BelongsTo {
        return $this->belongsTo(User::class);
    }

    public function task(): BelongsTo {
        return $this->belongsTo(Task::class, 'task_id');
    }
}
