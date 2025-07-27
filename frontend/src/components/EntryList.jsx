import { useState } from 'react';
import axios from 'axios';

export default function EntryList({ entries, categories, onRefresh }) {
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const startEditing = (entry) => {
    setEditingId(entry.id);
    setForm({
      date: entry.date.slice(0, 10),
      account: entry.account,
      amount: entry.amount,
      type: entry.type,
      categoryId: entry.categoryId,
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setForm({});
  };

  const saveEdit = async () => {
    try {
      await axios.put(`/api/entries/${editingId}`, form, { headers });
      setEditingId(null);
      onRefresh();
    } catch (err) {
      console.error(err);
      alert('Failed to update entry');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this entry?')) return;
    try {
      await axios.delete(`/api/entries/${id}`, { headers });
      onRefresh();
    } catch (err) {
      console.error(err);
      alert('Failed to delete entry');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <ul className="list-group">
      {entries.map((e) => (
        <li key={e.id} className="list-group-item">
          {editingId === e.id ? (
            <div className="row g-2 align-items-end">
              <div className="col-4">
                <input
                  name="date"
                  type="date"
                  className="form-control"
                  value={form.date}
                  onChange={handleChange}
                />
              </div>
              <div className="col-2">
                <input
                  name="account"
                  type="text"
                  className="form-control"
                  value={form.account}
                  onChange={handleChange}
                />
              </div>
              <div className="col-2">
                <input
                  name="amount"
                  type="number"
                  className="form-control"
                  value={form.amount}
                  onChange={handleChange}
                />
              </div>
              <div className="col-2">
                <select
                  name="type"
                  className="form-select"
                  value={form.type}
                  onChange={handleChange}
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div className="col-2">
                <select
                  name="categoryId"
                  className="form-select"
                  value={form.categoryId}
                  onChange={handleChange}
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-12 mt-2 text-end">
                <button className="btn btn-sm btn-success me-2" onClick={saveEdit}>
                  ✅ Save
                </button>
                <button className="btn btn-sm btn-secondary" onClick={cancelEditing}>
                  ❌ Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong>{e.type.toUpperCase()}</strong> - {e.account} <br />
                <small>({e.category?.name})</small><br />
                <small>{new Date(e.date).toLocaleDateString()}</small>
              </div>
              <div className="text-end">
                <div className="fw-bold">{e.amount.toLocaleString()}</div>
                <div className="btn-group mt-2">
                  <button className="btn btn-sm btn-outline-primary" onClick={() => startEditing(e)}>
                    ✏️
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(e.id)}>
                    ❌
                  </button>
                </div>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
