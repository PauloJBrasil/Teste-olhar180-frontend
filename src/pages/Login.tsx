import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(username, password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha no login');
    }
  };

  return (
    <div className="card">
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        <label>
          Usuário
          <input value={username} onChange={e => setUsername(e.target.value)} required />
        </label>
        <label>
          Senha
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>Entrar</button>
        <p>Não tem uma conta? <a href="/register">Cadastre-se</a></p>
      </form>
    </div>
  );
}