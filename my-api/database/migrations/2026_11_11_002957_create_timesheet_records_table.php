<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('timesheet_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('task_id')->nullable()->constrained('tasks')->nullOnDelete();
            $table->dateTime('from_date_time');
            $table->dateTime('to_date_time');
            $table->text('remark')->nullable();
            $table->timestamp('last_updated_at')->nullable();
            $table->timestamps();

            // Compound index for high-performance range filtering
            $table->index(['user_id', 'from_date_time']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('timesheet_records');
    }
};
