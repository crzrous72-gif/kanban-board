import type { Column } from '../types'

export const DEFAULT_COLUMNS: Column[] = [
  { id: 'todo', title: 'Por hacer', order: 0 },
  { id: 'doing', title: 'En progreso', order: 1 },
  { id: 'done', title: 'Hecho', order: 2 },
]