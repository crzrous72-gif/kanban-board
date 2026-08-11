import type { Task } from '../types'

export function normalizarOrden(tasks: Task[], columnId: string): Task[] {
  const enLaColumna = tasks
    .filter((t) => t.columnId === columnId)
    .sort((a, b) => a.order - b.order)
    .map((t, index) => ({ ...t, order: index }))

  const resto = tasks.filter((t) => t.columnId !== columnId)

  return [...resto, ...enLaColumna]
}