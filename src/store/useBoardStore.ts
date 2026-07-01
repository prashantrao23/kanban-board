import { create } from 'zustand'
import type { Priority, Task, TaskDraft } from '@/types/task'
import { generateId } from '@/utils/index'

interface BoardState {
  tasks: Task[]
  searchQuery: string
  priorityFilter: Priority | 'all'
  isModalOpen: boolean
  editingTaskId: string | null
  createTask: (draft: TaskDraft) => void
  updateTask: (taskId: string, draft: TaskDraft) => void
  deleteTask: (taskId: string) => void
  moveTask: (taskId: string, status: Task['status']) => void
  setSearchQuery: (query: string) => void
  setPriorityFilter: (priority: Priority | 'all') => void
  openCreateModal: () => void
  openEditModal: (taskId: string) => void
  closeModal: () => void
}

export const useBoardStore = create<BoardState>((set) => ({
  tasks: [],
  searchQuery: '',
  priorityFilter: 'all',
  isModalOpen: false,
  editingTaskId: null,
  createTask: (draft) =>
    set((state) => ({
      tasks: [
        ...state.tasks,
        {
          id: generateId('task'),
          title: draft.title.trim(),
          description: draft.description.trim(),
          status: draft.status,
          priority: draft.priority,
          labels: draft.labels,
          dueDate: draft.dueDate,
          createdAt: new Date().toISOString(),
        },
      ],
      isModalOpen: false,
      editingTaskId: null,
    })),
  updateTask: (taskId, draft) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
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
      ),
      isModalOpen: false,
      editingTaskId: null,
    })),
  deleteTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== taskId),
    })),
  moveTask: (taskId, status) =>
    set((state) => ({
      tasks: state.tasks.map((task) => (task.id === taskId ? { ...task, status } : task)),
    })),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setPriorityFilter: (priority) => set({ priorityFilter: priority }),
  openCreateModal: () => set({ isModalOpen: true, editingTaskId: null }),
  openEditModal: (taskId) => set({ isModalOpen: true, editingTaskId: taskId }),
  closeModal: () => set({ isModalOpen: false, editingTaskId: null }),
}))
