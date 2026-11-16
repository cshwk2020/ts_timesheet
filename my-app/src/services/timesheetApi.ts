const API_BASE_URL = "http://127.0.0.1:8000/api";

export const timesheetApi = {
  // Batch save dirty records
  async batchSave(token: string, records: any[]) {
    const response = await fetch(`${API_BASE_URL}/timesheets/batch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ records }),
    });

    if (!response.ok) {
      throw new Error(`Batch save failed with status ${response.status}`);
    }

    return await response.json();
  },

  // Fetch records for a given date range
  async fetchRange(token: string, userId: string, startDate: string, endDate: string) {
    const response = await fetch(
      `${API_BASE_URL}/timesheets?user_id=${userId}&start_date=${startDate}&end_date=${endDate}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch timesheet records");
    }

    return await response.json();
  }
};
