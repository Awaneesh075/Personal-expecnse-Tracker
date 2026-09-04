import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { useAuthStore } from '../store/useAuthStore';
import styles from './Auth.module.css';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { default: axios } = await import('axios');
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      login(res.data.data.user, res.data.data.token);
      navigate('/dashboard');
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.authCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Enter your credentials to access your account</p>
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" fullWidth disabled={loading} style={{ marginTop: '1rem' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
        <p className={styles.linkText}>
          Don't have an account? <Link to="/register" className={styles.link}>Sign up</Link>
        </p>
      </Card>
    </div>
  );
};
