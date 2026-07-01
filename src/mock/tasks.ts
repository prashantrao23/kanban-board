import type { Task } from '@/types/task'

export const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Design onboarding flow',
    description: 'Refine the first-time experience and update empty states.',
    status: 'backlog',
    priority: 'high',
    labels: [{ id: 'label-1', name: 'Design', color: '#4f46e5' }],
    dueDate: '2026-07-10',
    createdAt: '2026-06-28',
  },
  {
    id: 'task-2',
    title: 'Prepare sprint review',
    description: 'Collect updates and outline the main highlights.',
    status: 'todo',
    priority: 'medium',
    labels: [{ id: 'label-2', name: 'Ops', color: '#0f766e' }],
    dueDate: '2026-07-05',
    createdAt: '2026-06-29',
  },
  {
    id: 'task-3',
    title: 'Refine performance checklist',
    description: 'Review the latest board interactions and polish microcopy.',
    status: 'in-progress',
    priority: 'urgent',
    labels: [{ id: 'label-3', name: 'Engineering', color: '#b45309' }],
    dueDate: '2026-07-09',
    createdAt: '2026-06-30',
  },
  {
    id: 'task-4',
    title: 'Ship QA summary',
    description: 'Document validation notes and remaining follow-ups.',
    status: 'done',
    priority: 'low',
    labels: [{ id: 'label-4', name: 'Research', color: '#92400e' }],
    dueDate: '2026-07-02',
    createdAt: '2026-07-01',
  },
]
