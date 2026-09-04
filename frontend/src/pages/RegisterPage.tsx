import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { useAuthStore } from '../store/useAuthStore';
import styles from './Auth.module.css';

export const RegisterPage = () => {
  const [name, setName] = useState('');
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
      const res = await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
      login(res.data.data.user, res.data.data.token);
      navigate('/dashboard');
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.authCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.subtitle}>Start managing your finances today</p>
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <Input 
            label="Full Name" 
            type="text" 
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </form>
        <p className={styles.linkText}>
          Already have an account? <Link to="/login" className={styles.link}>Sign in</Link>
        </p>
      </Card>
    </div>
  );
};
