import { create } from 'zustand'
import type { Priority, Task, TaskDraft, TaskStatus } from '@/types/task'
import { generateId } from '@/utils/index'

const STORAGE_KEY = 'kanban-board.tasks'
const statusOrder: TaskStatus[] = ['backlog', 'todo', 'in-progress', 'done']

const INITIAL_SEED_TASKS: Task[] = [
  {
    id: 'task-auth-tokens',
    title: 'Audit token expiration and refresh flow',
    description: 'Ensure session timeout correctly revokes stale refresh tokens before staging deployment.',
    status: 'done',
    priority: 'high',
    labels: [{ id: 'lbl-eng', name: 'Engineering', color: '#2e7d4f' }],
    dueDate: '2026-11-01',
    createdAt: '2026-10-28T09:00:00.000Z',
  },
  {
    id: 'task-perf-metrics',
    title: 'Profile bundle size and code-split vendor chunks',
    description: 'Keep core landing bundle under 150kb gzip and defer secondary route chunks.',
    status: 'in-progress',
    priority: 'urgent',
    labels: [{ id: 'lbl-perf', name: 'Performance', color: '#b44c1e' }],
    dueDate: '2026-11-06',
    createdAt: '2026-10-29T10:30:00.000Z',
  },
  {
    id: 'task-a11y-audit',
    title: 'Keyboard navigation redline for modal and cards',
    description: 'Verify tab order, focus traps, and escape key dismiss across all dialogs.',
    status: 'todo',
    priority: 'medium',
    labels: [{ id: 'lbl-a11y', name: 'Accessibility', color: '#b45309' }],
    dueDate: '2026-11-09',
    createdAt: '2026-10-30T14:15:00.000Z',
  },
  {
    id: 'task-docs-release',
    title: 'Draft changelog notes and API migration guide',
    description: 'Summarize breaking changes and config updates for external integrators.',
    status: 'backlog',
    priority: 'low',
    labels: [{ id: 'lbl-docs', name: 'Docs', color: '#5e554a' }],
    dueDate: '2026-11-14',
    createdAt: '2026-10-31T11:00:00.000Z',
  },
]

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
    return INITIAL_SEED_TASKS
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw === null) {
      return INITIAL_SEED_TASKS
    }

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return INITIAL_SEED_TASKS
    }

    return parsed.filter(isTask)
  } catch {
    return INITIAL_SEED_TASKS
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
  }, { backlog: [], todo: [], 'in-progress': [], done: [] })

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
