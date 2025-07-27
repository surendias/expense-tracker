import { useState } from 'react';
import axios from 'axios';

export default function EntryForm({ categories, onCreated }) {
  const [form, setForm] = useState({
    date: '',
    account: '',
    amount: '',
    type: 'expense',
    categoryId: categories[0]?.id || ''
  });

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('/api/entries', form, { headers });
      onCreated?.();
      setForm({ ...form, amount: '', account: '' });
    } catch (err) {
      alert('Failed to add entry');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-2">
        <input
          name="date"
          type="date"
          className="form-control"
          placeholder="Date"
          value={form.date}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-2">
        <input
          name="account"
          type="text"
          className="form-control"
          placeholder="Account"
          value={form.account}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-2">
        <input
          name="amount"
          type="number"
          className="form-control"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-2">
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

      <div className="mb-3">
        <select
          name="categoryId"
          className="form-select"
          value={form.categoryId}
          onChange={handleChange}
        >
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <button type="submit" className="btn btn-success w-100">
        ➕ Add
      </button>
    </form>
  );
}
