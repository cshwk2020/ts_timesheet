import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";

// 計算 Popup 位置防出界
const calculatePopupPosition = (cellRect?: { left: number; bottom: number; top: number }) => {
  if (!cellRect) return { left: 100, top: 100 };
  const popupWidth = 320;
  const popupHeight = 250;
  let left = cellRect.left;
  let top = cellRect.bottom;

  if (top + popupHeight > window.innerHeight) {
    top = cellRect.top - popupHeight;
  }
  if (top < 0) {
    top = cellRect.bottom;
  }
  if (left + popupWidth > window.innerWidth) {
    left = window.innerWidth - popupWidth - 8;
  }
  if (left < 0) {
    left = 8;
  }
  return { left, top };
};

export const CellPopupEditor = () => {
  const dispatch = useDispatch();
  const editor = useSelector((s: RootState) => s.ui.editor);
  const categories = useSelector((s: RootState) => s.tasks.taskCategories);
  const tasks = useSelector((s: RootState) => s.tasks.tasks);
  const records = useSelector((s: RootState) => s.timesheet.records);

  // 搵出如果呢個 Cell 已經有 record，順便帶入去做編輯
  const existingRecord = records.find((r) => {
    if (!editor.date || editor.hour === undefined) return false;
    const hourStr = editor.hour.toString().padStart(2, "0");
    return r.fromDateTime === `${editor.date} ${hourStr}:00:00`;
  });

  const [categoryId, setCategoryId] = useState("");
  const [taskId, setTaskId] = useState("");
  const [remark, setRemark] = useState("");

  // 當 editor 打開或換咗 Cell，初始化 Local State
  useEffect(() => {
    if (existingRecord) {
      const t = tasks.find((x) => x.id === existingRecord.taskld);
      setCategoryId(t?.taskCategoryId ?? categories[0]?.id ?? "");
      setTaskId(existingRecord.taskld);
      setRemark(existingRecord.remark ?? "");
    } else {
      const defaultCat = categories[0]?.id ?? "";
      setCategoryId(defaultCat);
      const defaultTask = tasks.find((t) => t.taskCategoryId === defaultCat);
      setTaskId(defaultTask?.id ?? "");
      setRemark("");
    }
  }, [editor.open, existingRecord, categories, tasks]);

  if (!editor.open) return null;

  const visibleTasks = tasks.filter((t) => t.taskCategoryId === categoryId);
  const pos = calculatePopupPosition(editor.cellRect);

  const handleSave = () => {
    if (!editor.date || editor.hour === undefined) return;
    const hourStr = editor.hour.toString().padStart(2, "0");
    const fromDateTime = `${editor.date} ${hourStr}:00:00`;
    const toHourStr = (editor.hour + 1).toString().padStart(2, "0");
    const toDateTime = `${editor.date} ${toHourStr}:00:00`;

    if (existingRecord) {
      // Update
      dispatch({
        type: "RECORD_UPDATE",
        payload: {
          ...existingRecord,
          taskld: taskId,
          remark,
          lastUpdatedAt: new Date().toISOString(),
        },
      });
    } else {
      // Add
      dispatch({
        type: "RECORD_ADD",
        payload: {
          id: Date.now().toString(),
          userld: "u1",
          taskld: taskId,
          fromDateTime,
          toDateTime,
          remark,
          lastUpdatedAt: new Date().toISOString(),
        },
      });
    }
    dispatch({ type: "UI_CLOSE_EDITOR" });
  };

  const handleDelete = () => {
    if (existingRecord) {
      dispatch({
        type: "RECORD_DELETE",
        payload: { id: existingRecord.id },
      });
    }
    dispatch({ type: "UI_CLOSE_EDITOR" });
  };

  return (
    <div
      style={{
        position: "fixed",
        left: pos.left,
        top: pos.top,
        background: "white",
        border: "1px solid #ccc",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        padding: 12,
        width: 320,
        zIndex: 1000,
        borderRadius: 4,
      }}
    >
      <div style={{ marginBottom: 8 }}>
        <label style={{ display: "block", fontSize: 12, fontWeight: "bold" }}>Category</label>
        <select
          value={categoryId}
          onChange={(e) => {
            const newCatId = e.target.value;
            setCategoryId(newCatId);
            const firstTask = tasks.find((t) => t.taskCategoryId === newCatId);
            setTaskId(firstTask?.id ?? "");
          }}
          style={{ width: "100%", padding: 4 }}
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.taskCatDesc}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 8 }}>
        <label style={{ display: "block", fontSize: 12, fontWeight: "bold" }}>Task</label>
        <select
          value={taskId}
          onChange={(e) => setTaskId(e.target.value)}
          style={{ width: "100%", padding: 4 }}
        >
          {visibleTasks.map((task) => (
            <option key={task.id} value={task.id}>
              {task.taskDesc}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 8 }}>
        <label style={{ display: "block", fontSize: 12, fontWeight: "bold" }}>Remark</label>
        <input
          type="text"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          style={{ width: "100%", padding: 4, boxSizing: "border-box" }}
          placeholder="Optional remark..."
        />
      </div>

      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button onClick={handleSave} style={{ padding: "4px 12px", background: "#1976d2", color: "#fff", border: "none", borderRadius: 2 }}>
          Save
        </button>
        {existingRecord && (
          <button onClick={handleDelete} style={{ padding: "4px 12px", background: "#d32f2f", color: "#fff", border: "none", borderRadius: 2 }}>
            Delete
          </button>
        )}
        <button onClick={() => dispatch({ type: "UI_CLOSE_EDITOR" })} style={{ padding: "4px 12px", background: "#e0e0e0", border: "none", borderRadius: 2 }}>
          Cancel
        </button>
      </div>
    </div>
  );
};

