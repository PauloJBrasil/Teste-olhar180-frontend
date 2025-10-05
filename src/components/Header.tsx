import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  return (
    <header className="header">
      <h1>Gerenciador de Tarefas</h1>
      <nav className="nav">
        {user ? (
          <>
            <Link to="/">Tarefas</Link> {" | "}
            <Link to="/profile">Perfil</Link> {" | "}
            <Link to="/#" onClick={logout}>Sair</Link>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link> {" | "}
            <Link to="/register">Registrar</Link>
          </>
        )}
      </nav>
    </header>
  );
}