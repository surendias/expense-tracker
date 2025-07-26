import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import BudgetForm from '../BudgetForm';
import BudgetList from '../BudgetList';
import MonthlyLimitForm from '../MonthlyLimitForm';

export default function BudgetsTab({ categories, filters }) {
  const [budgets, setBudgets] = useState([]);
  const [monthlyLimit, setMonthlyLimit] = useState(null);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchBudgets = async () => {
    const res = await axios.get('/api/budgets', {
      headers,
      params: { month: filters.month }
    });
    setBudgets(res.data);
  };

  const fetchMonthlyLimit = async () => {
    const res = await axios.get('/api/monthly-limits', {
      headers,
      params: { month: filters.month }
    });
    setMonthlyLimit(res.data?.amount || null);
  };

  const refreshAll = () => {
    fetchBudgets();
    fetchMonthlyLimit();
  };

  useEffect(() => {
    if (filters.month) {
      refreshAll();
    }
  }, [filters.month]);

  const totalBudget = useMemo(
    () => budgets.reduce((sum, b) => sum + b.amount, 0),
    [budgets]
  );

  return (
    <div>
      <h5 className="mb-3">Monthly Spending Limit</h5>
      <MonthlyLimitForm
        selectedMonth={filters.month}
        onRefresh={fetchMonthlyLimit}
      />

      {monthlyLimit !== null && (
        <div className="alert alert-info">
          <strong>Total Limit:</strong> Rs. {monthlyLimit.toLocaleString()} <br />
          <strong>Allocated:</strong> Rs. {totalBudget.toLocaleString()} <br />
          <strong>Remaining:</strong> Rs. {(monthlyLimit - totalBudget).toLocaleString()}
        </div>
      )}

      <h5 className="mb-3 mt-4">Set Category Budgets</h5>
      {/* <BudgetForm
        categories={categories}
        selectedMonth={filters.month}
        onSaved={fetchBudgets}
      /> */}
      <BudgetList
  budgets={budgets}
  categories={categories}
  selectedMonth={filters.month}
  onRefresh={fetchBudgets}
/>
    </div>
  );
}
