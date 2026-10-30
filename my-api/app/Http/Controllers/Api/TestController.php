<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TestModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TestController extends Controller
{
    // Get all records
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => TestModel::all()
        ], 200);
    }

    // Save a new record
    public function store(Request $request) 
    {
        // Safe logging instead of echo (prevents corrupting JSON responses)
        Log::info('log...store called', $request->all());
      
        try {
            // Attempt to create the record
            $test = TestModel::create($request->all());
    
            return response()->json([
                'success' => true,
                'data' => $test
            ], 201);
    
        } catch (\Exception $e) {
            // Catch any exception and print the exact error message in the HTTP response
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ], 500);
        }
    }

    // Get a single record by ID
    public function show($id)
    {
        $record = TestModel::find($id);

        if (!$record) {
            return response()->json(['message' => 'Record not found'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $record
        ], 200);
    }

    // Update an existing record
    public function update(Request $request, $id)
    {
        $record = TestModel::find($id);

        if (!$record) {
            return response()->json(['message' => 'Record not found'], 404);
        }

        $validated = $request->validate([
            'text' => 'required|string|max:255',
        ]);

        $record->update($validated);

        return response()->json([
            'message' => 'Successfully updated!',
            'data' => $record
        ], 200);
    }

    // Delete a record
    public function destroy($id)
    {
        $record = TestModel::find($id);

        if (!$record) {
            return response()->json(['message' => 'Record not found'], 404);
        }

        $record->delete();

        return response()->json([
            'message' => 'Successfully deleted!'
        ], 200);
    }
}
