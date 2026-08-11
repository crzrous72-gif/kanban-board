export type Priority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  title: string
  description?: string
  priority: Priority
  labels: string[]
  dueDate?: string
  columnId: string
  order: number
  createdAt: string
}

export interface Column {
  id: string
  title: string
  order: number
  color?: string
}

export interface BoardState {
  columns: Column[]
  tasks: Task[]
}