import { useEffect, useState } from 'react';
import axios from 'axios';
import CategoryForm from './components/CategoryForm';
import EntryForm from './components/EntryForm';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Dashboard({ onLogout }) {
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [entries, setEntries] = useState([]);
  const [editingEntryId, setEditingEntryId] = useState(null);
  const [editEntryForm, setEditEntryForm] = useState({});
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');

  // Filters
  const [filterMonth, setFilterMonth] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchAll = async () => {
    const me = await axios.get('/api/me', { headers });
    setUser(me.data);

    const cats = await axios.get('/api/categories', { headers });
    setCategories(cats.data);

    const ents = await axios.get('/api/entries', { headers });
    setEntries(ents.data);
  };

  useEffect(() => {
    if (token) fetchAll();
  }, []);

  const filteredEntries = entries.filter((e) => {
    const matchMonth = filterMonth ? e.date.startsWith(filterMonth) : true;
    const matchType = filterType ? e.type === filterType : true;
    const matchCat = filterCategory ? e.categoryId == filterCategory : true;
    return matchMonth && matchType && matchCat;
  });

  const totalExpense = filteredEntries
    .filter((e) => e.type === 'expense')
    .reduce((sum, e) => sum + parseFloat(e.amount), 0);

  const totalIncome = filteredEntries
    .filter((e) => e.type === 'income')
    .reduce((sum, e) => sum + parseFloat(e.amount), 0);

  const chartData = {
    labels: categories.map((c) => c.name),
    datasets: [
      {
        label: 'Expenses by Category',
        backgroundColor: 'rgba(255,99,132,0.6)',
        data: categories.map((c) =>
          filteredEntries
            .filter((e) => e.type === 'expense' && e.categoryId === c.id)
            .reduce((sum, e) => sum + parseFloat(e.amount), 0)
        ),
      },
    ],
  };

  const handleEditCategory = (cat) => {
    setEditingCategoryId(cat.id);
    setEditCategoryName(cat.name);
  };

  const handleSaveCategory = async () => {
    await axios.put(`/api/categories/${editingCategoryId}`, { name: editCategoryName }, { headers });
    setEditingCategoryId(null);
    fetchAll();
  };

  const handleDeleteCategory = async (id) => {
    if (confirm('Delete this category?')) {
      await axios.delete(`/api/categories/${id}`, { headers });
      fetchAll();
    }
  };

  const handleEditEntry = (e) => {
    setEditingEntryId(e.id);
    setEditEntryForm({
      date: e.date.slice(0, 10),
      account: e.account,
      amount: e.amount,
      type: e.type,
      categoryId: e.categoryId,
    });
  };

  const handleChangeEntry = (e) =>
    setEditEntryForm({ ...editEntryForm, [e.target.name]: e.target.value });

  const handleSaveEntry = async () => {
    await axios.put(`/api/entries/${editingEntryId}`, editEntryForm, { headers });
    setEditingEntryId(null);
    fetchAll();
  };

  const handleDeleteEntry = async (id) => {
    if (confirm('Delete this entry?')) {
      await axios.delete(`/api/entries/${id}`, { headers });
      fetchAll();
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between mb-4">
        <h2>Dashboard</h2>
        <button className="btn btn-outline-secondary" onClick={onLogout}>Logout</button>
      </div>

      {user && <p>Welcome, <strong>{user.email}</strong></p>}

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-md-4">
          <input type="month" className="form-control" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} />
        </div>
        <div className="col-md-4">
          <select className="form-select" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="">All Types</option>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        <div className="col-md-4">
          <select className="form-select" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary */}
      <div className="row mb-4">
        <div className="col">
          <div className="alert alert-success">Income: {totalIncome}</div>
        </div>
        <div className="col">
          <div className="alert alert-danger">Expense: {totalExpense}</div>
        </div>
        <div className="col">
          <div className="alert alert-primary">Net: {totalIncome - totalExpense}</div>
        </div>
      </div>

      {/* Charts */}
      <div className="mb-4">
        <Bar data={chartData} />
      </div>

      <div className="row">
        {/* Categories */}
        <div className="col-md-4">
          <div className="card p-3 mb-4">
            <h5>Categories</h5>
            <CategoryForm onCreated={fetchAll} />
            <ul className="list-group">
              {categories.map((c) => (
                <li key={c.id} className="list-group-item d-flex justify-content-between">
                  {editingCategoryId === c.id ? (
                    <>
                      <input value={editCategoryName} onChange={(e) => setEditCategoryName(e.target.value)} className="form-control me-2" />
                      <button onClick={handleSaveCategory} className="btn btn-sm btn-success me-1">✅</button>
                      <button onClick={() => setEditingCategoryId(null)} className="btn btn-sm btn-secondary">❌</button>
                    </>
                  ) : (
                    <>
                      <span>{c.name}</span>
                      <div>
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEditCategory(c)}>✏️</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteCategory(c.id)}>&times;</button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Entries */}
        <div className="col-md-8">
          <div className="card p-3">
            <h5>Entries</h5>
            <EntryForm categories={categories} onCreated={fetchAll} />
            <ul className="list-group">
              {filteredEntries.map((e) => (
                <li key={e.id} className="list-group-item">
                  {editingEntryId === e.id ? (
                    <div className="row g-2 align-items-center">
                      <div className="col-md-2"><input type="date" name="date" className="form-control" value={editEntryForm.date} onChange={handleChangeEntry} /></div>
                      <div className="col-md-2"><input type="text" name="account" className="form-control" value={editEntryForm.account} onChange={handleChangeEntry} /></div>
                      <div className="col-md-2"><input type="number" name="amount" className="form-control" value={editEntryForm.amount} onChange={handleChangeEntry} /></div>
                      <div className="col-md-2">
                        <select name="type" className="form-select" value={editEntryForm.type} onChange={handleChangeEntry}>
                          <option value="expense">Expense</option>
                          <option value="income">Income</option>
                        </select>
                      </div>
                      <div className="col-md-2">
                        <select name="categoryId" className="form-select" value={editEntryForm.categoryId} onChange={handleChangeEntry}>
                          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                      <div className="col-md-2 d-flex">
                        <button className="btn btn-success me-2" onClick={handleSaveEntry}>✅</button>
                        <button className="btn btn-outline-secondary" onClick={() => setEditingEntryId(null)}>❌</button>
                      </div>
                    </div>
                  ) : (
                    <div className="d-flex justify-content-between">
                      <div><strong>{e.type.toUpperCase()}</strong> - {e.account} ({e.category.name})<br /><small>{new Date(e.date).toLocaleDateString()}</small></div>
                      <div>{e.amount}
                        <button className="btn btn-sm btn-outline-primary ms-2" onClick={() => handleEditEntry(e)}>✏️</button>
                        <button className="btn btn-sm btn-outline-danger ms-2" onClick={() => handleDeleteEntry(e.id)}>&times;</button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
