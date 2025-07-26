import { useState } from 'react';
import axios from 'axios';

export default function BudgetList({ categories, budgets, selectedMonth, onRefresh }) {
  const [editing, setEditing] = useState({});
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  // Create a map for faster lookup
  const budgetMap = Object.fromEntries(budgets.map(b => [b.categoryId, b]));

  const handleChange = (categoryId, field, value) => {
    setEditing(prev => ({
      ...prev,
      [categoryId]: { ...prev[categoryId], [field]: value }
    }));
  };

  const handleSave = async (categoryId) => {
  const existing = budgetMap[categoryId];
  const form = editing[categoryId] || {};

  if (!form.amount || isNaN(form.amount)) return alert("Invalid amount");

  if (existing) {
    await axios.put(`/api/budgets/${existing.id}`, { ...existing, ...form }, { headers });
  } else {
    await axios.post('/api/budgets', {
      month: selectedMonth,
      categoryId,
      amount: Number(form.amount)
    }, { headers });
  }

  await onRefresh(); // wait until refreshed
  setEditing(prev => ({ ...prev, [categoryId]: undefined }));
};


  const handleDelete = async (categoryId) => {
    const existing = budgetMap[categoryId];
    if (!existing) return;
    if (!window.confirm("Delete this budget?")) return;
    await axios.delete(`/api/budgets/${existing.id}`, { headers });
    onRefresh();
  };

  return (
    <ul className="list-group">
      {categories.map(cat => {
        const budget = budgetMap[cat.id];
        const isEditing = editing[cat.id] !== undefined;

        return (
          <li key={cat.id} className="list-group-item d-flex align-items-center justify-content-between">
            <strong className="me-3">{cat.name}</strong>

            {isEditing ? (
              <>
                <input
                  type="number"
                  value={editing[cat.id]?.amount || ''}
                  onChange={(e) => handleChange(cat.id, 'amount', e.target.value)}
                  className="form-control w-25 me-2"
                />
                <button className="btn btn-sm btn-success" onClick={() => handleSave(cat.id)}>💾</button>
                <button className="btn btn-sm btn-secondary ms-1" onClick={() => setEditing(prev => ({ ...prev, [cat.id]: undefined }))}>✖</button>
              </>
            ) : (
              <>
                <span className="me-3">{budget?.amount ? `Rs. ${budget.amount}` : <em className="text-muted">No budget</em>}</span>
                <div>
                  <button className="btn btn-sm btn-outline-primary me-1" onClick={() => setEditing(prev => ({ ...prev, [cat.id]: { amount: budget?.amount || '' } }))}>✏️</button>
                  {budget && <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(cat.id)}>🗑️</button>}
                </div>
              </>
            )}
          </li>
        );
      })}
    </ul>
  );
}
