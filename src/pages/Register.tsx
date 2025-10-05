import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { applyPhoneMask } from '../utils/phoneMask';

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await register({ username, password, email, phone });
      navigate('/', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao registrar');
    }
  };

  return (
    <div className="card">
      <h2>Registrar</h2>
      <form onSubmit={onSubmit}>
        <label>Usuário<input value={username} onChange={e => setUsername(e.target.value)} required /></label>
        <label>Senha<input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onFocus={() => setPasswordFocused(true)}
          onBlur={() => setPasswordFocused(false)}
          required
        /></label>
        {(
          <ul className="hint-list" style={{ display: passwordFocused ? 'block' : 'none' }}>
            <li className={password.length >= 6 ? 'ok' : 'bad'}>Mínimo 6 caracteres</li>
          </ul>
        )}
        <label>Email<input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></label>
        <label>Telefone<input
          value={phone}
          onChange={e => setPhone(applyPhoneMask(e.target.value))}
          required
          placeholder="(00) 00000-0000"
          inputMode="numeric"
          maxLength={15}
        /></label>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>Criar conta</button>
        <p>Já tem uma conta? <a href="/login">Faça login</a></p>
      </form>
    </div>
  );
}