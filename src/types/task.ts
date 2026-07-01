export type TaskStatus = 'backlog' | 'todo' | 'in-progress' | 'done'

export type Priority = 'low' | 'medium' | 'high' | 'urgent'

export interface Label {
  id: string
  name: string
  color: string
}

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: Priority
  labels: Label[]
  dueDate?: string
  createdAt: string
}

export interface TaskDraft {
  title: string
  description: string
  status: TaskStatus
  priority: Priority
  labels: Label[]
  dueDate?: string
}
