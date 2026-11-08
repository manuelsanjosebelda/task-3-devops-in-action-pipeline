import { useEffect, useMemo, useState } from 'react'
import type { Task, TaskStatus } from './types/task'
import TaskForm from './components/TaskForm'
import TaskCard from './components/TaskCard'
import './App.css'

const STORAGE_KEY = 'taskflow-tasks'

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Set up development environment',
    description: 'Prepare the tools and project structure.',
    status: 'completed',
    priority: 'high',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Build CI/CD pipeline',
    description: 'Automate build, tests and deployment.',
    status: 'in-progress',
    priority: 'high',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Configure application monitoring',
    description: 'Add metrics and dashboards.',
    status: 'pending',
    priority: 'medium',
    createdAt: new Date().toISOString(),
  },
]

function loadTasks(): Task[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) as Task[] : initialTasks
  } catch {
    return initialTasks
  }
}

function App() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>()

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  const stats = useMemo(() => ({
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    progress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  }), [tasks])

  const filteredTasks = useMemo(() => tasks.filter(task => {
    const matchesFilter = filter === 'all' || task.status === filter
    const matchesSearch = `${task.title} ${task.description}`
      .toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  }), [tasks, filter, search])

  function saveTask(data: Omit<Task, 'id' | 'createdAt'>) {
    if (editingTask) {
      setTasks(current => current.map(task =>
        task.id === editingTask.id ? { ...task, ...data } : task
      ))
    } else {
      setTasks(current => [{
        ...data,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      }, ...current])
    }
    closeForm()
  }

  function closeForm() {
    setShowForm(false)
    setEditingTask(undefined)
  }

  function deleteTask(id: string) {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(current => current.filter(task => task.id !== id))
    }
  }

  function updateStatus(id: string, status: TaskStatus) {
    setTasks(current => current.map(task =>
      task.id === id ? { ...task, status } : task
    ))
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-icon">T</span> TaskFlow</div>
        <p className="nav-label">WORKSPACE</p>
        <button className="nav-item active">▦ &nbsp; Overview</button>
        <button className="nav-item" onClick={() => setFilter('pending')}>◷ &nbsp; Pending</button>
        <button className="nav-item" onClick={() => setFilter('in-progress')}>↗ &nbsp; In progress</button>
        <button className="nav-item" onClick={() => setFilter('completed')}>✓ &nbsp; Completed</button>
        <div className="sidebar-footer">TaskFlow · DevOps project</div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <span>Workspace / Overview</span>
          <span className="user-avatar">TF</span>
        </header>

        <section className="page-content">
          <div className="page-heading">
            <div>
              <p className="eyebrow">YOUR WORKSPACE</p>
              <h1>Overview</h1>
              <p className="muted">Manage your tasks and keep your work moving.</p>
            </div>
            <button className="btn-primary" onClick={() => setShowForm(true)}>
              + New task
            </button>
          </div>

          <section className="stats-grid">
            <div className="stat-card"><span>Total tasks</span><strong>{stats.total}</strong><small>All tasks</small></div>
            <div className="stat-card"><span>Pending</span><strong>{stats.pending}</strong><small>Waiting to start</small></div>
            <div className="stat-card"><span>In progress</span><strong>{stats.progress}</strong><small>Currently active</small></div>
            <div className="stat-card"><span>Completed</span><strong>{stats.completed}</strong><small>Successfully finished</small></div>
          </section>

          <section className="tasks-section">
            <div className="section-heading">
              <div>
                <h2>My tasks</h2>
                <p className="muted">{filteredTasks.length} tasks found</p>
              </div>
            </div>

            <div className="toolbar">
              <input className="search-input" placeholder="Search tasks..."
                value={search} onChange={e => setSearch(e.target.value)} />
              <select value={filter} onChange={e => setFilter(e.target.value)}>
                <option value="all">All tasks</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="task-list">
              {filteredTasks.length ? filteredTasks.map(task => (
                <TaskCard key={task.id} task={task}
                  onStatusChange={updateStatus}
                  onEdit={task => { setEditingTask(task); setShowForm(true) }}
                  onDelete={deleteTask} />
              )) : <div className="empty-state">No tasks found. Create your first task.</div>}
            </div>
          </section>
        </section>
      </main>

      {showForm && (
        <div className="modal-backdrop" onClick={closeForm}>
          <section className="modal" onClick={e => e.stopPropagation()}>
            <h2>{editingTask ? 'Edit task' : 'Create a task'}</h2>
            <p className="muted">Fill in the details below.</p>
            <TaskForm task={editingTask} onSave={saveTask} onCancel={closeForm} />
          </section>
        </div>
      )}
    </div>
  )
}

export default App
