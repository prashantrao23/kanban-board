import type { Priority, TaskStatus } from '../types/task'

export const TASK_STATUSES: Array<{ value: TaskStatus; label: string }> = [
  { value: 'backlog', label: 'Backlog' },
  { value: 'todo', label: 'Todo' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
]

export const PRIORITY_VALUES: Array<{ value: Priority; label: string }> = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
]

export const DEFAULT_LABELS: Array<{ id: string; name: string; color: string }> = [
  { id: 'design', name: 'Design', color: '#4f46e5' },
  { id: 'engineering', name: 'Engineering', color: '#0f766e' },
  { id: 'research', name: 'Research', color: '#b45309' },
]
