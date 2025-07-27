import { useState } from 'react';
import axios from 'axios';

export default function CategoryList({ categories, onRefresh }) {
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const handleEditClick = (cat) => {
    setEditingId(cat.id);
    setEditText(cat.name);
  };

  const handleSave = async () => {
    try {
      await axios.put(`/api/categories/${editingId}`, { name: editText }, { headers });
      setEditingId(null);
      setEditText('');
      onRefresh();
    } catch (err) {
      console.error(err);
      alert('Failed to update category');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(`/api/categories/${id}`, { headers });
      onRefresh();
    } catch (err) {
      console.error(err);
      alert('Failed to delete category');
    }
  };

  return (
    <ul className="list-group">
      {categories.map((cat) => (
        <li key={cat.id} className="list-group-item d-flex justify-content-between align-items-center">
          {editingId === cat.id ? (
            <>
              <input
                className="form-control me-2"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />
              <button className="btn btn-sm btn-success me-2" onClick={handleSave}>✅</button>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => setEditingId(null)}>❌</button>
            </>
          ) : (
            <>
              <span>{cat.name}</span>
              <div>
                <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEditClick(cat)}>✏️</button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(cat.id)}>&times;</button>
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
