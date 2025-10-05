import React, { useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { applyPhoneMask } from '../utils/phoneMask';

export default function Profile() {
  const { user, updateProfile, loading } = useAuth();
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!user) return <p>Você precisa estar logado.</p>;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    try {
      await updateProfile({ email, phone, password: password || undefined });
      setPassword('');
      setMessage('Perfil atualizado.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao atualizar perfil');
    }
  };

  return (
    <div className="card">
      <h2>Perfil</h2>
      <p><strong>Usuário:</strong> {user.username}</p>
      <form onSubmit={onSubmit}>
        <label>Email<input type="email" value={email} onChange={e => setEmail(e.target.value)} /></label>
        <label>Telefone<input
          value={phone}
          onChange={e => setPhone(applyPhoneMask(e.target.value))}
          placeholder="(00) 00000-0000"
          inputMode="numeric"
          maxLength={15}
        /></label>
        <label>Nova Senha<input type="password" value={password} onChange={e => setPassword(e.target.value)} /></label>
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>Salvar</button>
      </form>
    </div>
  );
} 'Pendente';