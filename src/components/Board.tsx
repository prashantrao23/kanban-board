import { Plus } from 'lucide-react'
import { Column } from '@/components/Column'
import { useBoardStore } from '@/store/useBoardStore'
import type { Task } from '@/types/task'

const columns = [
  { key: 'backlog' as const, title: 'Backlog' },
  { key: 'todo' as const, title: 'Todo' },
  { key: 'in-progress' as const, title: 'In Progress' },
  { key: 'done' as const, title: 'Done' },
]

export function Board() {
  const tasks = useBoardStore((state) => state.tasks)
  const searchQuery = useBoardStore((state) => state.searchQuery)
  const priorityFilter = useBoardStore((state) => state.priorityFilter)
  const openCreateModal = useBoardStore((state) => state.openCreateModal)
  const openEditModal = useBoardStore((state) => state.openEditModal)
  const deleteTask = useBoardStore((state) => state.deleteTask)
  const moveTask = useBoardStore((state) => state.moveTask)

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter
    return matchesSearch && matchesPriority
  })

  const groupedTasks = columns.reduce<Record<string, Task[]>>((acc, column) => {
    acc[column.key] = filteredTasks.filter((task) => task.status === column.key)
    return acc
  }, {})

  return (
    <main className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Workspace</p>
          <h2 className="text-[28px] font-semibold text-slate-900">Product Launch Board</h2>
        </div>
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-[12px] bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_6px_-1px_rgba(53,37,205,0.2)]"
          onClick={openCreateModal}
        >
          <Plus size={16} />
          New Task
        </button>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="flex min-w-[920px] gap-4 lg:min-w-0 lg:grid lg:grid-cols-4 lg:gap-4">
          {columns.map((column) => (
            <Column
              key={column.key}
              title={column.title}
              count={groupedTasks[column.key].length}
              tasks={groupedTasks[column.key]}
              empty={groupedTasks[column.key].length === 0}
              onAddTask={openCreateModal}
              onEditTask={openEditModal}
              onDeleteTask={deleteTask}
              onMoveTask={moveTask}
            />
          ))}
        </div>
      </div>
    </main>
  )
}
