import { CalendarDays, GripVertical, MessageSquareText, PencilLine, Trash2 } from 'lucide-react'
import type { Task, TaskStatus } from '@/types/task'
import { cn } from '@/utils/index'

interface TaskCardProps {
  task: Task
  onEdit: () => void
  onDelete: () => void
  onMove: (taskId: string, status: TaskStatus) => void
}

const priorityStyles: Record<Task['priority'], string> = {
  low: 'bg-emerald-50 text-emerald-700',
  medium: 'bg-amber-50 text-amber-700',
  high: 'bg-rose-50 text-rose-700',
  urgent: 'bg-indigo-50 text-indigo-700',
}

const statusOptions: Array<{ value: TaskStatus; label: string }> = [
  { value: 'backlog', label: 'Backlog' },
  { value: 'todo', label: 'Todo' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
]

export function TaskCard({ task, onEdit, onDelete, onMove }: TaskCardProps) {
  return (
    <article className="rounded-[16px] border border-slate-200 bg-white p-4 shadow-[0_1px_3px_0_rgba(15,23,42,0.08),0_1px_2px_-1px_rgba(15,23,42,0.06)]">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className={cn('rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em]', priorityStyles[task.priority])}>
              {task.priority}
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">#{task.id.split('-').pop()}</span>
          </div>
          <h4 className="text-[15px] font-semibold text-slate-900">{task.title}</h4>
        </div>
        <button type="button" className="rounded-full p-1 text-slate-400" aria-label="Drag task">
          <GripVertical size={16} />
        </button>
      </div>

      <p className="mb-4 line-clamp-3 text-sm leading-6 text-slate-600">{task.description}</p>

      <div className="mb-4 flex flex-wrap gap-2">
        {task.labels.map((label) => (
          <span key={label.id} className="rounded-full border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
            {label.name}
          </span>
        ))}
      </div>

      <div className="mb-3 flex items-center gap-2">
        <label className="flex-1">
          <span className="sr-only">Move task</span>
          <select
            className="w-full rounded-[10px] border border-slate-200 bg-slate-50 px-2.5 py-2 text-sm text-slate-600 outline-none"
            value={task.status}
            onChange={(event) => onMove(task.id, event.target.value as TaskStatus)}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <button type="button" className="rounded-full p-2 text-slate-500" onClick={onEdit} aria-label={`Edit ${task.title}`}>
          <PencilLine size={14} />
        </button>
        <button type="button" className="rounded-full p-2 text-rose-600" onClick={onDelete} aria-label={`Delete ${task.title}`}>
          <Trash2 size={14} />
        </button>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <CalendarDays size={14} />
          <span>{task.dueDate ?? 'No due date'}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-[11px] font-semibold text-slate-600">
            AJ
          </div>
          <MessageSquareText size={14} />
        </div>
      </div>
    </article>
  )
}
