<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Task extends Model {
    protected $fillable = ['user_id', 'category_id', 'name', 'description', 'is_active'];

    public function category(): BelongsTo {
        return $this->belongsTo(TaskCategory::class, 'category_id');
    }

    public function timesheetRecords(): HasMany {
        return $this->hasMany(TimesheetRecord::class, 'task_id');
    }
}
