import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function generateId(prefix = 'task') {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`
}
