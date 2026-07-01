import {
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { Column } from '@/components/Column'
import { TaskCard } from '@/components/TaskCard'
import { useBoardStore } from '@/store/useBoardStore'
import type { Task, TaskStatus } from '@/types/task'

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
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)
  const [draggedOverColumn, setDraggedOverColumn] = useState<TaskStatus | null>(null)

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter
      return matchesSearch && matchesPriority
    })
  }, [priorityFilter, searchQuery, tasks])

  const groupedTasks = useMemo(() => {
    return columns.reduce<Record<string, Task[]>>((accumulator, column) => {
      accumulator[column.key] = filteredTasks.filter((task) => task.status === column.key)
      return accumulator
    }, {})
  }, [filteredTasks])

  const activeTask = useMemo(() => filteredTasks.find((task) => task.id === activeTaskId) ?? null, [activeTaskId, filteredTasks])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveTaskId(String(event.active.id))
    setDraggedOverColumn(null)
  }, [])

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const overId = event.over?.id
      if (typeof overId === 'string' && overId.startsWith('column-')) {
        setDraggedOverColumn(overId.replace('column-', '') as TaskStatus)
        return
      }

      const overTask = tasks.find((task) => task.id === overId)
      setDraggedOverColumn(overTask?.status ?? null)
    },
    [tasks],
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      setActiveTaskId(null)
      setDraggedOverColumn(null)

      if (!over) {
        return
      }

      const activeId = String(active.id)
      const overId = String(over.id)
      const sourceTask = tasks.find((task) => task.id === activeId)

      if (!sourceTask) {
        return
      }

      const targetStatus = overId.startsWith('column-')
        ? (overId.replace('column-', '') as TaskStatus)
        : (tasks.find((task) => task.id === overId)?.status ?? sourceTask.status)

      const targetTasks = tasks.filter((task) => task.status === targetStatus && task.id !== activeId)
      let targetIndex = targetTasks.length

      if (!overId.startsWith('column-')) {
        const overTask = tasks.find((task) => task.id === overId)
        if (overTask?.status === targetStatus) {
          targetIndex = targetTasks.findIndex((task) => task.id === overId)
          if (targetIndex < 0) {
            targetIndex = targetTasks.length
          }
        }
      }

      moveTask(activeId, targetStatus, targetIndex)
    },
    [moveTask, tasks],
  )

  const handleDragCancel = useCallback(() => {
    setActiveTaskId(null)
    setDraggedOverColumn(null)
  }, [])

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <main className="space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Workspace</p>
            <h2 className="text-[28px] font-semibold text-slate-900">Product Launch Board</h2>
          </div>
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-[12px] bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_6px_-1px_rgba(53,37,205,0.2)] transition hover:-translate-y-0.5 hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
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
                status={column.key}
                title={column.title}
                count={groupedTasks[column.key].length}
                tasks={groupedTasks[column.key]}
                empty={groupedTasks[column.key].length === 0}
                isDraggingOver={draggedOverColumn === column.key}
                onAddTask={openCreateModal}
                onEditTask={openEditModal}
                onDeleteTask={deleteTask}
                onMoveTask={moveTask}
              />
            ))}
          </div>
        </div>
      </main>

      <DragOverlay dropAnimation={{ duration: 180, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' }}>
        {activeTask ? <TaskCard task={activeTask} onEdit={() => undefined} onDelete={() => undefined} onMove={() => undefined} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  )
}
