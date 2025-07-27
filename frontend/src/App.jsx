import { useState, useEffect } from 'react';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';

export default function App() {
  const [isAuthenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuthenticated(false);
  };

  return (
    <div className="container py-5">
      {isAuthenticated ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <div className="row justify-content-center">
          <div className="col-md-5 mb-4">
            <SignupForm onSuccess={() => setAuthenticated(true)} />
          </div>
          <div className="col-md-5 mb-4">
            <LoginForm onSuccess={() => setAuthenticated(true)} />
          </div>
        </div>
      )}
    </div>
  );
}
