import { useState, type FormEvent } from 'react'
import type { Task, TaskPriority } from '../types/task'

interface Props {
  task?: Task
  onSave: (data: Omit<Task, 'id' | 'createdAt'>) => void
  onCancel: () => void
}

export default function TaskForm({ task, onSave, onCancel }: Props) {
  const [title, setTitle] = useState(task?.title ?? '')
  const [description, setDescription] = useState(task?.description ?? '')
  const [priority, setPriority] = useState<TaskPriority>(task?.priority ?? 'medium')
  const [dueDate, setDueDate] = useState(task?.dueDate ?? '')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!title.trim()) return

    onSave({
      title: title.trim(),
      description: description.trim(),
      priority,
      status: task?.status ?? 'pending',
      dueDate: dueDate || undefined,
    })
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <label>
        Task title
        <input value={title} onChange={e => setTitle(e.target.value)}
          placeholder="What needs to be done?" required maxLength={100} />
      </label>

      <label>
        Description
        <textarea value={description} onChange={e => setDescription(e.target.value)}
          placeholder="Add some details..." rows={3} maxLength={500} />
      </label>

      <div className="form-row">
        <label>
          Priority
          <select value={priority}
            onChange={e => setPriority(e.target.value as TaskPriority)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>

        <label>
          Due date
          <input type="date" value={dueDate}
            onChange={e => setDueDate(e.target.value)} />
        </label>
      </div>

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          {task ? 'Save changes' : 'Create task'}
        </button>
      </div>
    </form>
  )
}
