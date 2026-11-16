<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\TestController;
use App\Http\Controllers\Api\TimesheetController;

use App\Http\Controllers\Api\AuthController; 


// Public route
Route::post('/login', [AuthController::class, 'login']);

// Protected routes (requires valid JWT)
Route::middleware('auth:api')->group(function () {
  
    Route::get('/user-profile', [AuthController::class, 'userProfile']);
    Route::post('/logout', [AuthController::class, 'logout']);
});



Route::middleware('auth:sanctum')->group(function () {
  
    // Fetch records for a date range (e.g., current week)
    Route::get('/timesheets', [TimesheetController::class, 'index']);
    
    // Batch save/upsert dirty records
    Route::post('/timesheets/batch', [TimesheetController::class, 'batchStore']);
});





/////////////////////////////

Route::get('/test', [TestController::class, 'index']);
Route::post('/test', [TestController::class, 'store']);
Route::get('/test/{id}', [TestController::class, 'show']);
Route::put('/test/{id}', [TestController::class, 'update']);
Route::delete('/test/{id}', [TestController::class, 'destroy']);


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


