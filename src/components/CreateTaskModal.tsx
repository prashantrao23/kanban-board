import { CalendarDays, CircleDot, Flag, Tag, X } from 'lucide-react'
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
      .map((name) => ({ id: generateId('label'), name, color: '#b44c1e' }))

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1f1b16]/35 backdrop-blur-[2px] p-3 sm:p-4 overflow-y-auto">
      <div
        id="task-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-dialog-title"
        tabIndex={-1}
        className="my-auto w-full max-w-[560px] max-h-[calc(100dvh-1.5rem)] overflow-y-auto rounded-xl border border-[#e4ded4] bg-[#fdfbf7] p-4 sm:p-6 shadow-[0_16px_36px_rgba(31,27,22,0.14)]"
      >
        <div className="mb-4 sm:mb-5 flex items-start justify-between gap-3 border-b border-[#e4ded4]/70 pb-3 sm:pb-3.5">
          <div>
            <h2 id="task-dialog-title" className="text-base sm:text-lg font-medium text-[#1f1b16]">
              {task ? 'Edit task' : 'New task'}
            </h2>
            <p className="mt-0.5 text-xs text-[#7b7266]">
              {task ? 'Update task details and stage.' : 'Add a task to the launch board.'}
            </p>
          </div>
          <button
            type="button"
            className="rounded-md p-1.5 text-[#7b7266] transition hover:bg-[#efe9df] hover:text-[#1f1b16] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#b44c1e]"
            aria-label="Close modal"
            onClick={onClose}
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-3.5 sm:gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2" htmlFor="task-title">
            <span className="mb-1 block text-xs font-medium text-[#5e554a]">Title</span>
            <input
              id="task-title"
              className="w-full rounded-lg border border-[#e4ded4] bg-[#efe9df]/40 px-3 py-2 text-base sm:text-sm text-[#1f1b16] outline-none placeholder:text-[#7b7266] transition focus:border-[#b44c1e] focus:bg-white focus:ring-1 focus:ring-[#b44c1e]/20"
              placeholder="e.g. Audit accessibility contrast across forms"
              value={formValues.title}
              onChange={(event) => handleFieldChange('title', event.target.value)}
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? 'task-title-error' : undefined}
            />
            {errors.title ? <p id="task-title-error" className="mt-1 text-xs text-[#b91c1c]">{errors.title}</p> : null}
          </label>

          <label className="block sm:col-span-2" htmlFor="task-description">
            <span className="mb-1 block text-xs font-medium text-[#5e554a]">Description</span>
            <textarea
              id="task-description"
              className="min-h-[88px] sm:min-h-[96px] w-full rounded-lg border border-[#e4ded4] bg-[#efe9df]/40 px-3 py-2 text-base sm:text-sm text-[#1f1b16] outline-none placeholder:text-[#7b7266] transition focus:border-[#b44c1e] focus:bg-white focus:ring-1 focus:ring-[#b44c1e]/20"
              placeholder="Add key context, acceptance notes, or links..."
              value={formValues.description}
              onChange={(event) => handleFieldChange('description', event.target.value)}
            />
          </label>

          <label className="block" htmlFor="task-status">
            <span className="mb-1 block text-xs font-medium text-[#5e554a]">Status</span>
            <div className="flex items-center gap-2 rounded-lg border border-[#e4ded4] bg-[#efe9df]/40 px-2.5 py-2 text-sm text-[#5e554a] transition focus-within:border-[#b44c1e] focus-within:bg-white">
              <CircleDot size={14} className="text-[#7b7266] shrink-0" />
              <select
                id="task-status"
                className="w-full cursor-pointer bg-transparent text-base sm:text-sm text-[#1f1b16] outline-none"
                value={formValues.status}
                onChange={(event) => handleFieldChange('status', event.target.value)}
              >
                <option value="backlog">Backlog</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </label>

          <label className="block" htmlFor="task-priority">
            <span className="mb-1 block text-xs font-medium text-[#5e554a]">Priority</span>
            <div className="flex items-center gap-2 rounded-lg border border-[#e4ded4] bg-[#efe9df]/40 px-2.5 py-2 text-sm text-[#5e554a] transition focus-within:border-[#b44c1e] focus-within:bg-white">
              <Flag size={14} className="text-[#7b7266] shrink-0" />
              <select
                id="task-priority"
                className="w-full cursor-pointer bg-transparent text-base sm:text-sm text-[#1f1b16] outline-none"
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
            <span className="mb-1 block text-xs font-medium text-[#5e554a]">Labels</span>
            <div className="flex items-center gap-2 rounded-lg border border-[#e4ded4] bg-[#efe9df]/40 px-2.5 py-2 text-sm text-[#5e554a] transition focus-within:border-[#b44c1e] focus-within:bg-white">
              <Tag size={14} className="text-[#7b7266] shrink-0" />
              <input
                id="task-labels"
                className="w-full bg-transparent text-base sm:text-sm text-[#1f1b16] placeholder:text-[#7b7266] outline-none"
                placeholder="Design, Engineering"
                value={formValues.labelsInput}
                onChange={(event) => handleFieldChange('labelsInput', event.target.value)}
              />
            </div>
          </label>

          <label className="block" htmlFor="task-due-date">
            <span className="mb-1 block text-xs font-medium text-[#5e554a]">Due date</span>
            <div className="flex items-center gap-2 rounded-lg border border-[#e4ded4] bg-[#efe9df]/40 px-2.5 py-2 text-sm text-[#5e554a] transition focus-within:border-[#b44c1e] focus-within:bg-white">
              <CalendarDays size={14} className="text-[#7b7266] shrink-0" />
              <input
                id="task-due-date"
                className="w-full cursor-pointer bg-transparent text-base sm:text-sm text-[#1f1b16] outline-none"
                type="date"
                value={formValues.dueDate ?? ''}
                onChange={(event) => handleFieldChange('dueDate', event.target.value)}
              />
            </div>
          </label>

          <div className="mt-2 flex flex-col-reverse xs:flex-row sm:flex-row justify-end gap-2 sm:gap-2.5 border-t border-[#e4ded4]/70 pt-3.5 sm:pt-4 sm:col-span-2">
            <button
              type="button"
              className="w-full xs:w-auto sm:w-auto rounded-lg border border-[#e4ded4] bg-white px-3.5 py-2.5 sm:py-2 text-xs font-medium text-[#5e554a] transition hover:bg-[#efe9df] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#b44c1e]"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full xs:w-auto sm:w-auto rounded-lg bg-[#b44c1e] px-4 py-2.5 sm:py-2 text-xs font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] transition hover:bg-[#9c3e16] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b44c1e]/40"
            >
              {task ? 'Save changes' : 'Create task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
