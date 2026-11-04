import type { Priority, TaskStatus } from '../types/task'

export const TASK_STATUSES: Array<{ value: TaskStatus; label: string }> = [
  { value: 'backlog', label: 'Backlog' },
  { value: 'todo', label: 'To Do' },
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
  { id: 'design', name: 'Design', color: '#b44c1e' },
  { id: 'engineering', name: 'Engineering', color: '#2e7d4f' },
  { id: 'research', name: 'Research', color: '#b45309' },
]
