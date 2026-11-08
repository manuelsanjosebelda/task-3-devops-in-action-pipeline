import type { Task, TaskStatus } from '../types/task'

interface Props {
  task: Task
  onStatusChange: (id: string, status: TaskStatus) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

export default function TaskCard({ task, onStatusChange, onEdit, onDelete }: Props) {
  return (
    <article className="task-card">
      <div className="task-main">
        <div className="task-heading">
          <h3>{task.title}</h3>
          <span className={`priority priority-${task.priority}`}>
            {task.priority}
          </span>
        </div>

        {task.description && <p className="task-description">{task.description}</p>}

        <div className="task-meta">
          <select aria-label={`Status of ${task.title}`}
            value={task.status}
            onChange={e => onStatusChange(task.id, e.target.value as TaskStatus)}>
            <option value="pending">Pending</option>
            <option value="in-progress">In progress</option>
            <option value="completed">Completed</option>
          </select>

          {task.dueDate && <span>Due: {task.dueDate}</span>}
        </div>
      </div>

      <div className="task-actions">
        <button onClick={() => onEdit(task)} aria-label="Edit task">Edit</button>
        <button className="delete-action" onClick={() => onDelete(task.id)}
          aria-label="Delete task">Delete</button>
      </div>
    </article>
  )
}
