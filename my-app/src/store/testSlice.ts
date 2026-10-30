import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { TestItem } from '../types/TestTs';

// Use 10.0.2.2 for Android emulator / local testing if needed, or http://localhost:8000
const API_URL = 'http://localhost:8000/api/test';

// 1. Fetch all recordsefetchtestitem t
export const fetchTestItems = createAsyncThunk('test/fetchItems', async () => {
  const response = await fetch(API_URL);
  const result = await response.json();
  return result.data; // Matches Laravel response structure
});

// 2. Create a record
export const createTestItem = createAsyncThunk('test/createItem', async (payload: { text: string }) => {
  console.log('createTestItem...log...');
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(payload), // payload is already { text: "..." }
  });
  console.log('AFTER FETCH...');
  const result = await response.json();
  console.log('result==', result, result.data);
  
  return result.data;
});


// 3. Update a record
export const updateTestItem = createAsyncThunk(
  'test/updateItem',
  async ({ id, text }: { id: number; text: string }) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ text }),
    });
    const result = await response.json();
    return result.data; // Returns updated item from Laravel
  }
);


// 4. Delete a record
export const deleteTestItem = createAsyncThunk('test/deleteItem', async (id: number) => {
  await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: { 'Accept': 'application/json' },
  });
  return id;
});



interface TestState {
  items: TestItem[];
  status: 'idle' | 'loading' | 'failed';
}

const initialState: TestState = {
  items: [],
  status: 'idle',
};

export const testSlice = createSlice({
  name: 'test',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchTestItems.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      // Create
      .addCase(createTestItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      // Update
      .addCase(updateTestItem.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      
      // Delete
      .addCase(deleteTestItem.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export default testSlice.reducer;
