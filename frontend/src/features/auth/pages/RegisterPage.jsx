import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/authApi';
import { useAuth } from '../AuthContext';
import AuthCard from '../components/AuthCard';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ username:'', email:'', password:'', doctrine:'ember_rite', bastionName:'Ashenbastion' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await register(form);
      login(data.user);
      navigate('/game/bastion');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally { setLoading(false); }
  }

  return <AuthCard title="Create your bastion" subtitle="Register, choose a doctrine, and begin the first playable Ashenbastion loop.">
    <form onSubmit={submit} className="grid" style={{gap:12, marginTop:16}}>
      <input className="input" placeholder="Username" value={form.username} onChange={e=>setForm({...form, username:e.target.value})} />
      <input className="input" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
      <input className="input" type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} />
      <input className="input" placeholder="Bastion name" value={form.bastionName} onChange={e=>setForm({...form, bastionName:e.target.value})} />
      <select className="input" value={form.doctrine} onChange={e=>setForm({...form, doctrine:e.target.value})}>
        <option value="ember_rite">Ember Rite</option>
        <option value="warborn">Warborn Creed</option>
        <option value="stone_oath">Stone Oath</option>
        <option value="veil_path">Veil Path</option>
        <option value="harvest_covenant">Harvest Covenant</option>
      </select>
      {error ? <div className="error">{error}</div> : null}
      <button className="btn" disabled={loading}>{loading ? 'Creating...' : 'Register and Enter'}</button>
      <button type="button" className="btn secondary" onClick={()=>navigate('/login')}>Already have an account? Login</button>
    </form>
  </AuthCard>;
}
