import { CalendarDays, Circle, Search, Sparkles, X } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import type { Priority, Task, TaskDraft, TaskStatus } from '@/types/task'
import { generateId } from '@/utils/index'

export interface TaskFormValues {
  title: string
  description: string
  status: TaskStatus
  priority: Priority
  labelsInput: string
  dueDate?: string
}

type FormErrors = Partial<Record<keyof TaskFormValues, string>>

interface CreateTaskModalProps {
  open: boolean
  task?: Task | null
  onClose: () => void
  onSubmit: (draft: TaskDraft) => void
}

function getInitialFormValues(task?: Task | null): TaskFormValues {
  return {
    title: task?.title ?? '',
    description: task?.description ?? '',
    status: task?.status ?? 'backlog',
    priority: task?.priority ?? 'medium',
    labelsInput: task?.labels.map((label) => label.name).join(', ') ?? '',
    dueDate: task?.dueDate ?? '',
  }
}

export function CreateTaskModal({ open, task, onClose, onSubmit }: CreateTaskModalProps) {
  const [formValues, setFormValues] = useState<TaskFormValues>(() => getInitialFormValues(task))
  const [errors, setErrors] = useState<FormErrors>({})

  useEffect(() => {
    if (!open) {
      return
    }

    const dialog = document.getElementById('task-dialog')
    dialog?.focus()

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open, onClose])

  if (!open) {
    return null
  }

  const handleFieldChange = (field: keyof TaskFormValues, value: string) => {
    setFormValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors: FormErrors = {}

    if (!formValues.title.trim()) {
      nextErrors.title = 'Title is required'
    } else if (formValues.title.trim().length > 100) {
      nextErrors.title = 'Title must be 100 characters or fewer'
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    const labels = formValues.labelsInput
      .split(',')
      .map((label) => label.trim())
      .filter(Boolean)
      .map((name) => ({ id: generateId('label'), name, color: '#4f46e5' }))

    onSubmit({
      title: formValues.title.trim(),
      description: formValues.description.trim(),
      status: formValues.status,
      priority: formValues.priority,
      labels,
      dueDate: formValues.dueDate?.trim() || undefined,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-4">
      <div
        id="task-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-dialog-title"
        tabIndex={-1}
        className="w-full max-w-[640px] rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_20px_25px_-5px_rgba(15,23,42,0.1),0_8px_10px_-6px_rgba(15,23,42,0.1)]"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{task ? 'Edit task' : 'Create task'}</p>
            <h2 id="task-dialog-title" className="text-[24px] font-semibold text-slate-900">{task ? 'Update task' : 'New task'}</h2>
          </div>
          <button type="button" className="rounded-full p-2 text-slate-400" aria-label="Close modal" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <label className="md:col-span-2 block" htmlFor="task-title">
            <span className="mb-2 block text-sm font-medium text-slate-700">Title</span>
            <input
              id="task-title"
              className="w-full rounded-[10px] border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none"
              placeholder="Task title"
              value={formValues.title}
              onChange={(event) => handleFieldChange('title', event.target.value)}
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? 'task-title-error' : undefined}
            />
            {errors.title ? <p id="task-title-error" className="mt-1 text-sm text-rose-600">{errors.title}</p> : null}
          </label>

          <label className="md:col-span-2 block" htmlFor="task-description">
            <span className="mb-2 block text-sm font-medium text-slate-700">Description</span>
            <textarea
              id="task-description"
              className="min-h-[112px] w-full rounded-[10px] border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none"
              placeholder="Add a short summary"
              value={formValues.description}
              onChange={(event) => handleFieldChange('description', event.target.value)}
            />
          </label>

          <label className="block" htmlFor="task-status">
            <span className="mb-2 block text-sm font-medium text-slate-700">Status</span>
            <div className="flex items-center gap-2 rounded-[10px] border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600">
              <Circle size={14} />
              <select
                id="task-status"
                className="w-full bg-transparent outline-none"
                value={formValues.status}
                onChange={(event) => handleFieldChange('status', event.target.value)}
              >
                <option value="backlog">Backlog</option>
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </label>

          <label className="block" htmlFor="task-priority">
            <span className="mb-2 block text-sm font-medium text-slate-700">Priority</span>
            <div className="flex items-center gap-2 rounded-[10px] border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600">
              <Sparkles size={14} />
              <select
                id="task-priority"
                className="w-full bg-transparent outline-none"
                value={formValues.priority}
                onChange={(event) => handleFieldChange('priority', event.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </label>

          <label className="block" htmlFor="task-labels">
            <span className="mb-2 block text-sm font-medium text-slate-700">Labels</span>
            <div className="flex items-center gap-2 rounded-[10px] border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600">
              <Search size={14} />
              <input
                id="task-labels"
                className="w-full bg-transparent outline-none"
                placeholder="Design, Engineering"
                value={formValues.labelsInput}
                onChange={(event) => handleFieldChange('labelsInput', event.target.value)}
              />
            </div>
          </label>

          <label className="block" htmlFor="task-due-date">
            <span className="mb-2 block text-sm font-medium text-slate-700">Due date</span>
            <div className="flex items-center gap-2 rounded-[10px] border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600">
              <CalendarDays size={14} />
              <input
                id="task-due-date"
                className="w-full bg-transparent outline-none"
                type="date"
                value={formValues.dueDate ?? ''}
                onChange={(event) => handleFieldChange('dueDate', event.target.value)}
              />
            </div>
          </label>

          <div className="md:col-span-2 mt-2 flex flex-wrap justify-end gap-3">
            <button type="button" className="rounded-[10px] border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="rounded-[10px] bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white">
              {task ? 'Save Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
