import { useState } from 'react';
import { authAPI } from '../api';
import { useAuthStore } from '../store';
import styles from './Auth.module.css';

export default function Auth() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const login = useAuthStore((s) => s.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } =
        mode === 'login'
          ? await authAPI.login({ email: form.email, password: form.password })
          : await authAPI.register(form);
      login(data.user, data.token);
    } catch (err) {
      setError(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.logo}>🎵 Music3D</h1>
        <div className={styles.tabs}>
          <button className={mode === 'login' ? styles.active : ''} onClick={() => setMode('login')}>Login</button>
          <button className={mode === 'register' ? styles.active : ''} onClick={() => setMode('register')}>Register</button>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          {mode === 'register' && (
            <input placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
          )}
          <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.submit}>
            {mode === 'login' ? 'Enter' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  );
}
