import { useState, useEffect } from 'react';
import axios from 'axios';

export default function BudgetForm({ categories, selectedMonth, onSaved }) {
  const [form, setForm] = useState({
    categoryId: '',
    amount: ''
  });

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    // Clear form when selectedMonth changes
    setForm({ categoryId: '', amount: '' });
  }, [selectedMonth]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/api/budgets', {
  month: selectedMonth,
  categoryId: parseInt(form.categoryId),
  amount: parseFloat(form.amount),
}, { headers });
    onSaved?.();
    setForm({ ...form, amount: '' }); // clear only amount
  };

  return (
    <form onSubmit={handleSubmit} className="mb-3">
      <div className="row g-2">
        <div className="col-md-5">
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Select Category</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="col-md-5">
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="Amount"
            className="form-control"
            required
          />
        </div>
        <div className="col-md-2">
          <button className="btn btn-success w-100">+</button>
        </div>
      </div>
    </form>
  );
}
