import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import Summary from '../Summary';

export default function SummaryTab({ entries, categories, filters }) {
  const [budgets, setBudgets] = useState([]);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchBudgets = async () => {
      const res = await axios.get('/api/budgets', {
        headers,
        params: { month: filters.month }
      });
      setBudgets(res.data);
    };

    if (filters.month) fetchBudgets();
  }, [filters.month]);

  // Group actual spend by categoryId
  const actualSpendMap = useMemo(() => {
    return entries.reduce((acc, e) => {
      const id = e.categoryId;
      acc[id] = (acc[id] || 0) + parseFloat(e.amount);
      return acc;
    }, {});
  }, [entries]);

  return (
    <>
      <h5 className="mb-3">Summary</h5>
      <Summary entries={entries} />

      <h6 className="mt-4">Summary by Category</h6>
      <ul className="list-group">
        {categories.map(cat => {
          const budget = budgets.find(b => b.categoryId === cat.id);
          const actual = actualSpendMap[cat.id] || 0;
          const budgeted = budget?.amount || 0;
          const diff = budgeted - actual;
          const over = diff < 0;

          return (
            <li key={cat.id} className="list-group-item d-flex justify-content-between align-items-center">
              <strong>{cat.name}</strong>
              <div className="text-end">
                <div>Budgeted: Rs. {budgeted.toLocaleString()}</div>
                <div>Spent: Rs. {actual.toLocaleString()}</div>
                <div className={over ? 'text-danger' : 'text-success'}>
                  {over ? 'Over by' : 'Remaining'}: Rs. {Math.abs(diff).toLocaleString()}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
