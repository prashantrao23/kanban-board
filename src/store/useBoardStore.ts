import { create } from 'zustand'
import type { Priority, Task, TaskDraft, TaskStatus } from '@/types/task'
import { generateId } from '@/utils/index'

const STORAGE_KEY = 'kanban-board.tasks'
const statusOrder: TaskStatus[] = ['backlog', 'todo', 'in-progress', 'done']

interface BoardState {
  tasks: Task[]
  searchQuery: string
  priorityFilter: Priority | 'all'
  isModalOpen: boolean
  editingTaskId: string | null
  persistError: string | null
  createTask: (draft: TaskDraft) => void
  updateTask: (taskId: string, draft: TaskDraft) => void
  deleteTask: (taskId: string) => void
  moveTask: (taskId: string, status: TaskStatus, targetIndex?: number) => void
  setSearchQuery: (query: string) => void
  setPriorityFilter: (priority: Priority | 'all') => void
  openCreateModal: () => void
  openEditModal: (taskId: string) => void
  closeModal: () => void
  loadTasks: () => void
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isTask(value: unknown): value is Task {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.id === 'string' &&
    typeof value.title === 'string' &&
    typeof value.description === 'string' &&
    typeof value.createdAt === 'string' &&
    ['backlog', 'todo', 'in-progress', 'done'].includes(value.status as string) &&
    ['low', 'medium', 'high', 'urgent'].includes(value.priority as string) &&
    Array.isArray(value.labels)
  )
}

function readTasksFromStorage(): Task[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return []
    }

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.filter(isTask)
  } catch {
    return []
  }
}

function writeTasksToStorage(tasks: Task[]) {
  if (typeof window === 'undefined') {
    return true
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    return true
  } catch {
    return false
  }
}

function reorderTaskList(tasks: Task[], taskId: string, status: TaskStatus, targetIndex?: number): Task[] {
  const taskToMove = tasks.find((task) => task.id === taskId)

  if (!taskToMove) {
    return tasks
  }

  const grouped = statusOrder.reduce<Record<TaskStatus, Task[]>>((accumulator, columnStatus) => {
    accumulator[columnStatus] = []
    return accumulator
  }, {} as Record<TaskStatus, Task[]>)

  tasks.forEach((task) => {
    if (task.id !== taskId) {
      grouped[task.status].push(task)
    }
  })

  const targetTasks = grouped[status]
  const normalizedIndex = targetIndex ?? targetTasks.length
  const updatedTask = { ...taskToMove, status }

  targetTasks.splice(normalizedIndex, 0, updatedTask)

  return statusOrder.flatMap((columnStatus) => grouped[columnStatus])
}

export const useBoardStore = create<BoardState>((set, get) => ({
  tasks: readTasksFromStorage(),
  searchQuery: '',
  priorityFilter: 'all',
  isModalOpen: false,
  editingTaskId: null,
  persistError: null,
  createTask: (draft) => {
    const previousTasks = get().tasks
    const nextTask: Task = {
      id: generateId('task'),
      title: draft.title.trim(),
      description: draft.description.trim(),
      status: draft.status,
      priority: draft.priority,
      labels: draft.labels,
      dueDate: draft.dueDate,
      createdAt: new Date().toISOString(),
    }

    const nextTasks = [...previousTasks, nextTask]
    set({ tasks: nextTasks, isModalOpen: false, editingTaskId: null, persistError: null })

    if (!writeTasksToStorage(nextTasks)) {
      set({ tasks: previousTasks, persistError: 'Unable to save changes locally.' })
    }
  },
  updateTask: (taskId, draft) => {
    const previousTasks = get().tasks
    const nextTasks = previousTasks.map((task) =>
      task.id === taskId
        ? {
            ...task,
            title: draft.title.trim(),
            description: draft.description.trim(),
            status: draft.status,
            priority: draft.priority,
            labels: draft.labels,
            dueDate: draft.dueDate,
          }
        : task,
    )

    set({ tasks: nextTasks, isModalOpen: false, editingTaskId: null, persistError: null })

    if (!writeTasksToStorage(nextTasks)) {
      set({ tasks: previousTasks, persistError: 'Unable to save changes locally.' })
    }
  },
  deleteTask: (taskId) => {
    const previousTasks = get().tasks
    const nextTasks = previousTasks.filter((task) => task.id !== taskId)
    set({ tasks: nextTasks, persistError: null })

    if (!writeTasksToStorage(nextTasks)) {
      set({ tasks: previousTasks, persistError: 'Unable to save changes locally.' })
    }
  },
  moveTask: (taskId, status, targetIndex) => {
    const previousTasks = get().tasks
    const nextTasks = reorderTaskList(previousTasks, taskId, status, targetIndex)

    set({ tasks: nextTasks, persistError: null })

    if (!writeTasksToStorage(nextTasks)) {
      set({ tasks: previousTasks, persistError: 'Unable to save changes locally.' })
    }
  },
  setSearchQuery: (query) => set({ searchQuery: query }),
  setPriorityFilter: (priority) => set({ priorityFilter: priority }),
  openCreateModal: () => set({ isModalOpen: true, editingTaskId: null }),
  openEditModal: (taskId) => set({ isModalOpen: true, editingTaskId: taskId }),
  closeModal: () => set({ isModalOpen: false, editingTaskId: null }),
  loadTasks: () => {
    set({ tasks: readTasksFromStorage(), persistError: null })
  },
}))
