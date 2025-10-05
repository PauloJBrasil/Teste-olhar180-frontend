import React, { useState } from 'react';
import { TaskPayload, TaskItem } from '../types';

type Props = {
  onSave: (data: TaskPayload) => Promise<void> | void;
  task?: TaskItem | null;
  onCancel?: () => void;
};

export default function TaskForm({ onSave, task, onCancel }: Props) {
  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [status, setStatus] = useState<TaskPayload['status']>(task?.status ?? 'pending');

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    await onSave({ title, description, status });
  }

  return (
    <form onSubmit={submit} className="row-inputs">
      <input placeholder="Título" value={title} onChange={e => setTitle(e.target.value)} required />
      <select value={status} onChange={e => setStatus(e.target.value as TaskPayload['status'])}>
        <option value="pending">Pendente</option>
        <option value="in_progress">Em progresso</option>
        <option value="done">Concluída</option>
      </select>
      <textarea placeholder="Descrição" value={description} onChange={e => setDescription(e.target.value)} />
      <div className='row'>
        <button type="submit">Salvar</button>
        {onCancel && (
          <button type="button" className="secondary" onClick={onCancel}>Cancelar</button>
        )}
      </div>
    </form>
  );
}