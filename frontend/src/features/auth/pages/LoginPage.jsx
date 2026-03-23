import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginApi } from '../api/authApi';
import { useAuth } from '../AuthContext';
import AuthCard from '../components/AuthCard';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email:'', password:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await loginApi(form);
      login(data.user);
      navigate('/game/bastion');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally { setLoading(false); }
  }

  return <AuthCard title="Return to Ashenbastion" subtitle="Continue your first playable loop.">
    <form onSubmit={submit} className="grid" style={{gap:12, marginTop:16}}>
      <input className="input" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
      <input className="input" type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} />
      {error ? <div className="error">{error}</div> : null}
      <button className="btn" disabled={loading}>{loading ? 'Entering...' : 'Login'}</button>
      <button type="button" className="btn secondary" onClick={()=>navigate('/register')}>Need an account? Register</button>
    </form>
  </AuthCard>;
}
