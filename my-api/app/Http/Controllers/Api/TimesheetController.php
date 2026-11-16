namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TimesheetRecord;

class TimesheetController extends Controller {

    public function index(Request $request) {
        $userId = $request->user()->id;
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');

        $records = TimesheetRecord::where('user_id', $userId)
            ->whereBetween('from_date_time', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
            ->with('task')
            ->get();

        return response()->json($records);
    }

  
  public function batchStore(Request $request) {
        $userId = $request->user()->id;
        $incomingRecords = $request->input('records', []);

        // 2. Wrap everything in a database transaction
        $savedRecords = DB::transaction(function () use ($userId, $incomingRecords) {
            $records = [];

            foreach ($incomingRecords as $row) {
                $record = TimesheetRecord::updateOrCreate(
                    [
                        'user_id' => $userId,
                        'from_date_time' => $row['fromDateTime'],
                    ],
                    [
                        'to_date_time' => $row['toDateTime'],
                        'task_id' => $row['taskId'] ?? null,
                        'remark' => $row['remark'] ?? '',
                        'last_updated_at' => now(),
                    ]
                );
                $records[] = $record;
            }

            return $records; // Returns the collection out of the transaction block
        });

        return response()->json([
            'message' => 'Batch saved successfully',
            'data' => $savedRecords
        ]);
    }

}



