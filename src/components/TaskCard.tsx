import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CalendarDays, GripVertical, MessageSquareText, PencilLine, Trash2 } from 'lucide-react'
import { memo } from 'react'
import type { Task, TaskStatus } from '@/types/task'
import { cn } from '@/utils/index'

interface TaskCardProps {
  task: Task
  onEdit: () => void
  onDelete: () => void
  onMove: (taskId: string, status: TaskStatus) => void
  isOverlay?: boolean
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

export const TaskCard = memo(function TaskCard({ task, onEdit, onDelete, onMove, isOverlay = false }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { type: 'task', task, columnId: task.status },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: 'none' as const,
  }

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={cn(
        'rounded-[16px] border border-slate-200 bg-white p-4 shadow-[0_1px_3px_0_rgba(15,23,42,0.08),0_1px_2px_-1px_rgba(15,23,42,0.06)] transition',
        isDragging && 'scale-[1.01] opacity-80 shadow-[0_20px_25px_-5px_rgba(15,23,42,0.12)]',
        isOverlay && 'cursor-grabbing rotate-1 shadow-[0_20px_25px_-5px_rgba(15,23,42,0.12)]',
      )}
      aria-label={`${task.title} task card`}
    >
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
        <button
          type="button"
          className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          aria-label={`Drag ${task.title}`}
          {...attributes}
          {...listeners}
        >
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
            className="w-full rounded-[10px] border border-slate-200 bg-slate-50 px-2.5 py-2 text-sm text-slate-600 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            value={task.status}
            onChange={(event) => onMove(task.id, event.target.value as TaskStatus)}
            aria-label={`Move ${task.title}`}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <button type="button" className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500" onClick={onEdit} aria-label={`Edit ${task.title}`}>
          <PencilLine size={14} />
        </button>
        <button type="button" className="rounded-full p-2 text-rose-600 transition hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500" onClick={onDelete} aria-label={`Delete ${task.title}`}>
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
})
