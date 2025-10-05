import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import TaskList from './pages/TaskList';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import { AuthProvider, useAuth } from './components/AuthContext';
import Header from './components/Header';

function AppRoutes() {
  const { user } = useAuth();
  // Quando logado: mostrar somente Tarefas e Perfil; demais rotas redirecionam para "/"
  // Quando não logado: mostrar somente Login e Registrar; demais rotas redirecionam para "/login"
  if (user) {
    return (
      <Routes>
        <Route path="/" element={<TaskList />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <main className="container">
          <AppRoutes />
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}