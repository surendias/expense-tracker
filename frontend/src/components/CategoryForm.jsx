import { useState } from 'react';
import axios from 'axios';

export default function CategoryForm({ onCreated }) {
  const [form, setForm] = useState({ name: '', type: 'expense' });
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/categories', form, { headers });
      setForm({ name: '', type: 'expense' });
      onCreated?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating category');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-3">
      <div className="input-group mb-2">
        <input
          type="text"
          name="name"
          className="form-control"
          placeholder="New category"
          value={form.name}
          onChange={handleChange}
          required
        />
        <select
          name="type"
          className="form-select"
          value={form.type}
          onChange={handleChange}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <button className="btn btn-outline-primary" type="submit">Add</button>
      </div>
      {error && <div className="text-danger mt-1">{error}</div>}
    </form>
  );
}
