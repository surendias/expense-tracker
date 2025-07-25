import { useEffect, useState } from 'react';
import axios from 'axios';
import MobileTabs from './MobileTabs';

export default function Dashboard({ onLogout }) {
    const currentMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [entries, setEntries] = useState([]);
  const [filters, setFilters] = useState({
    month: currentMonth,
    type: '',
    categoryId: '',
  });

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchUserAndCategories = async () => {
    const [me, cats] = await Promise.all([
      axios.get('/api/me', { headers }),
      axios.get('/api/categories', { headers }),
    ]);
    setUser(me.data);
    setCategories(cats.data);
  };

  const fetchEntries = async () => {
    const res = await axios.get('/api/entries', {
      headers,
      params: filters, // filters passed as query params
    });
    setEntries(res.data);
  };

  useEffect(() => {
    if (token) {
      fetchUserAndCategories();
      fetchEntries();
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchEntries(); // refetch entries whenever filters change
    }
  }, [filters]);

  return user ? (
    <MobileTabs
      user={user}
      categories={categories}
      entries={entries}
      filters={filters}
      setFilters={setFilters}
      fetchAll={() => {
        fetchUserAndCategories();
        fetchEntries();
      }}
      onLogout={onLogout}
    />
  ) : null;
}
