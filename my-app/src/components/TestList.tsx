import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { 
  fetchTestItems, 
  createTestItem, 
  updateTestItem, 
  deleteTestItem 
} from '../store/testSlice';

export const TestList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector((state: RootState) => state.test.items);

  const [text, setText] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  // 1. Fetch data on initial load
  useEffect(() => {
    dispatch(fetchTestItems());
  }, [dispatch]);

  // 2. Add new record
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    dispatch(createTestItem({ text }));
    setText('');
  };

  // 3. Save updated record
  const handleSaveUpdate = (id: number) => {
    dispatch(updateTestItem({ id, text: editText }));
    setEditingId(null);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>CRUD Test Interface</h2>

      {/* Input Form */}
      <form onSubmit={handleAdd}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter item text..."
        />
        <button type="submit">Add Item</button>
      </form>

      {/* Item List */}
            {/* Item List */}
      <ul style={{ marginTop: '20px', listStyleType: 'none', padding: 0 }}>
        {items.map((item) => (
          <li 
            key={item.id} 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr auto auto', // Column 1: Text takes remaining space, Column 2 & 3: Buttons take auto width
              alignItems: 'center', 
              gap: '10px', 
              marginBottom: '10px' 
            }}
          >
            {editingId === item.id ? (
              <>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button onClick={() => handleSaveUpdate(item.id)}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span style={{ textAlign: 'left', justifySelf: 'start', wordBreak: 'break-all' }}>
  {item.text}
</span>
                <button
                  onClick={() => {
                    setEditingId(item.id);
                    setEditText(item.text);
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => dispatch(deleteTestItem(item.id))}
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>

    </div>
  );
};
