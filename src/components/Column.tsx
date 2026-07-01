import { MoreHorizontal, Plus } from 'lucide-react'
import type { Task, TaskStatus } from '@/types/task'
import { TaskCard } from '@/components/TaskCard'

interface ColumnProps {
  title: string
  count: number
  tasks: Task[]
  empty?: boolean
  onAddTask: () => void
  onEditTask: (taskId: string) => void
  onDeleteTask: (taskId: string) => void
  onMoveTask: (taskId: string, status: TaskStatus) => void
}

export function Column({ title, count, tasks, empty = false, onAddTask, onEditTask, onDeleteTask, onMoveTask }: ColumnProps) {
  return (
    <section className="flex min-h-[360px] min-w-[280px] flex-col rounded-[20px] border border-slate-200 bg-white p-4 shadow-[0_1px_3px_0_rgba(15,23,42,0.08),0_1px_2px_-1px_rgba(15,23,42,0.06)] lg:min-w-[300px]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
          <h3 className="text-[15px] font-semibold text-slate-900">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-600">
            {count}
          </span>
          <button type="button" className="rounded-full p-1 text-slate-400" aria-label={`More options for ${title}`}>
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {empty ? (
          <div className="flex min-h-[220px] flex-col items-center justify-center rounded-[16px] border border-dashed border-slate-200 bg-slate-50/70 px-4 py-8 text-center">
            <div className="mb-3 rounded-full bg-indigo-50 p-3 text-indigo-600">
              <Plus size={18} />
            </div>
            <p className="mb-1 text-sm font-semibold text-slate-700">Nothing here yet</p>
            <p className="max-w-[180px] text-sm leading-6 text-slate-500">Add a task to keep momentum going.</p>
          </div>
        ) : (
          tasks.map((task) => <TaskCard key={task.id} task={task} onEdit={() => onEditTask(task.id)} onDelete={() => onDeleteTask(task.id)} onMove={onMoveTask} />)
        )}
      </div>

      <button type="button" className="mt-4 flex items-center justify-center gap-2 rounded-[12px] border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-700" onClick={onAddTask}>
        <Plus size={16} />
        Add Task
      </button>
    </section>
  )
}
