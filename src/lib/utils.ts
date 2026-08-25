import type { Task } from '../types'

export function normalizarOrden(tasks: Task[], columnId: string): Task[] {
  const enLaColumna = tasks
    .filter((t) => t.columnId === columnId)
    .sort((a, b) => a.order - b.order)
    .map((t, index) => ({ ...t, order: index }))

  const resto = tasks.filter((t) => t.columnId !== columnId)

  return [...resto, ...enLaColumna]
}

export function formatearFecha(iso: string): string {
  const [year, month, day] = iso.slice(0, 10).split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
  })
}
