<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Task;
use App\Models\TaskCategory;

class TaskController extends Controller {
    public function index(Request $request) {
        $userId = $request->user()->id;
        
        $categories = TaskCategory::with('tasks')
            ->where('user_id', $userId)
            ->get();

        return response()->json($categories);
    }

    public function storeTask(Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'nullable|exists:task_categories,id',
            'description' => 'nullable|string'
        ]);

        $task = Task::create([
            'user_id' => $request->user()->id,
            'category_id' => $validated['category_id'] ?? null,
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
        ]);

        return response()->json($task, 201);
    }
}



