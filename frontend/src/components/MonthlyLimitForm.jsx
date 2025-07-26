import { useState, useEffect } from 'react';
import axios from 'axios';

export default function MonthlyLimitForm({ selectedMonth, onRefresh }) {
  const [limit, setLimit] = useState('');
  const [limitId, setLimitId] = useState(null);
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (selectedMonth) {
      axios
        .get(`/api/monthly-limits?month=${selectedMonth}`, { headers })
        .then(res => {
          if (res.data) {
            setLimit(res.data.amount);
            setLimitId(res.data.id);
          } else {
            setLimit('');
            setLimitId(null);
          }
        });
    }
  }, [selectedMonth]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMonth || !limit) return;

    const data = { month: selectedMonth, amount: parseFloat(limit) };

    if (limitId) {
      await axios.put(`/api/monthly-limits/${limitId}`, data, { headers });
    } else {
      await axios.post('/api/monthly-limits', data, { headers });
    }

    onRefresh?.();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-3">
      <div className="input-group">
        <span className="input-group-text">Monthly Limit</span>
        <input
          type="number"
          className="form-control"
          value={limit}
          onChange={e => setLimit(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-primary">
          {limitId ? 'Update' : 'Set'}
        </button>
      </div>
    </form>
  );
}
