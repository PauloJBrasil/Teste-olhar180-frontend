import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../api';
import TaskForm from '../components/TaskForm';
import type { TaskItem, TaskPayload, TaskStatus } from '../types';

export default function TaskList() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [selected, setSelected] = useState<TaskItem | null>(null);
  const [detailId, setDetailId] = useState<number | null>(null);

  async function fetchTasks() {
    setLoading(true);
    try {
      const res = await api.get<TaskItem[]>('/tasks');
      setTasks(res.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar tarefas');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchTasks(); }, []);

  async function createTask(data: TaskPayload) {
    try {
      const res = await api.post<TaskItem>('/tasks', data);
      setCreating(false);
      setTasks(prev => [res.data, ...prev]);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao criar tarefa');
    }
  }

  async function updateTask(id: number, data: TaskPayload) {
    try {
      const res = await api.put<TaskItem>(`/tasks/${id}`, data);
      setSelected(null);
      setTasks(prev => prev.map(t => (t.id === id ? res.data : t)));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao atualizar tarefa');
    }
  }

  async function deleteTask(id: number) {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao excluir tarefa');
    }
  }

  function getStatus(status: TaskStatus) {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'done': return 'Concluída';
      case 'in_progress': return 'Em Progresso';
      default: return 'Desconhecido';
    }
  }

  const content = useMemo(() => {
    if (loading) return <div className="card">Carregando...</div>;
    if (error) return <div className="card">{error}</div>;
    if (!tasks.length) return <div className="card">Nenhuma tarefa encontrada.</div>;
    return (
      <div>
        {tasks.map(t => (
          <div key={t.id} className="card task">
            <p className='info'>Titulo</p>
            <h3>{t.title}</h3>
            <p className='info'>Descrição</p>
            <p style={{ marginTop: 0}}>{t.description || 'Sem descrição'}</p>
            <p>Status: {getStatus(t.status)}</p>
            <div className="row">
              <button disabled={t.status === 'done'} onClick={() => setSelected(t)}>Editar</button>
              <button className="secondary" onClick={() => setDetailId(detailId === t.id ? null : t.id)}>Detalhes</button>
              <button className="secondary" disabled={t.status === 'done'} onClick={() => deleteTask(t.id)}>Excluir</button>
            </div>
            {detailId === t.id && (
              <div className="grid">
                <div>Criada em: {new Date(t.createdAt).toLocaleString()}</div>
                <div>Atualizada em: {t.updatedAt ? new Date(t.updatedAt).toLocaleString() : '—'}</div>
              </div>
            )}
            {selected?.id === t.id && (
              <TaskForm task={t} onSave={(data) => updateTask(t.id, data)} onCancel={() => setSelected(null)} />
            )}
          </div>
        ))}
      </div>
    );
  }, [tasks, loading, error, detailId, selected]);

  return (
    <div>
      <div className="card">
        <div className="row">
          <button onClick={() => setCreating(true)}>Nova Tarefa</button>
          <button className="secondary" onClick={fetchTasks}>Atualizar</button>
        </div>
        {creating && (
          <TaskForm onSave={createTask} onCancel={() => setCreating(false)} />
        )}
      </div>
      {content}
    </div>
  );
}
