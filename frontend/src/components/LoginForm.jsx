import { useState } from 'react';
import axios from 'axios';

export default function LoginForm({ onSuccess }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="card p-4 shadow-sm mb-4">
      <h4 className="mb-3">Log In</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <input type="email" name="email" className="form-control" placeholder="Email" onChange={handleChange} required />
        </div>
        <div className="mb-2">
          <input type="password" name="password" className="form-control" placeholder="Password" onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-success w-100">Log In</button>
        {error && <div className="text-danger mt-2">{error}</div>}
      </form>
    </div>
  );
}
