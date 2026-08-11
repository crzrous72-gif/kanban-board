import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { BoardState, Column, Task } from '../types'
import { DEFAULT_COLUMNS } from '../lib/constants'
import { normalizarOrden } from '../lib/utils'

type NuevaTarea = Omit<Task, 'id' | 'columnId' | 'order' | 'createdAt'>

interface BoardStore extends BoardState {
  addColumn: (title: string) => void
  updateColumn: (id: string, patch: Partial<Column>) => void
  deleteColumn: (id: string) => void
  reorderColumns: (fromIndex: number, toIndex: number) => void
  addTask: (columnId: string, data: NuevaTarea) => void
  updateTask: (id: string, patch: Partial<Task>) => void
  deleteTask: (id: string) => void
  moveTask: (taskId: string, toColumnId: string, toIndex: number) => void
}

export const useBoardStore = create<BoardStore>()(
  persist(
    (set) => ({
      columns: DEFAULT_COLUMNS,
      tasks: [],

      addColumn: (title) =>
        set((state) => ({
          columns: [
            ...state.columns,
            { id: crypto.randomUUID(), title: title.trim(), order: state.columns.length },
          ],
        })),

      updateColumn: (id, patch) =>
        set((state) => ({
          columns: state.columns.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        })),

      deleteColumn: (id) =>
        set((state) => ({
          columns: state.columns
            .filter((c) => c.id !== id)
            .map((c, index) => ({ ...c, order: index })),
          tasks: state.tasks.filter((t) => t.columnId !== id),
        })),

      reorderColumns: (fromIndex, toIndex) =>
        set((state) => {
          const columns = [...state.columns].sort((a, b) => a.order - b.order)
          const [movida] = columns.splice(fromIndex, 1)
          columns.splice(toIndex, 0, movida)
          return { columns: columns.map((c, index) => ({ ...c, order: index })) }
        }),

      addTask: (columnId, data) =>
        set((state) => {
          const enLaColumna = state.tasks.filter((t) => t.columnId === columnId)
          const nueva: Task = {
            ...data,
            id: crypto.randomUUID(),
            columnId,
            order: enLaColumna.length,
            createdAt: new Date().toISOString(),
          }
          return { tasks: [...state.tasks, nueva] }
        }),

      updateTask: (id, patch) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        })),

      deleteTask: (id) =>
        set((state) => {
          const eliminada = state.tasks.find((t) => t.id === id)
          if (!eliminada) return {}
          const restantes = state.tasks.filter((t) => t.id !== id)
          return { tasks: normalizarOrden(restantes, eliminada.columnId) }
        }),

      moveTask: (taskId, toColumnId, toIndex) =>
        set((state) => {
          const tarea = state.tasks.find((t) => t.id === taskId)
          if (!tarea) return {}

          const columnaOrigen = tarea.columnId
          const otras = state.tasks.filter((t) => t.id !== taskId)

          const destino = otras
            .filter((t) => t.columnId === toColumnId)
            .sort((a, b) => a.order - b.order)

          destino.splice(toIndex, 0, { ...tarea, columnId: toColumnId })

          const reordenadas = destino.map((t, index) => ({ ...t, order: index }))
          const resto = otras.filter((t) => t.columnId !== toColumnId)

          return { tasks: normalizarOrden([...resto, ...reordenadas], columnaOrigen) }
        }),
    }),
    { name: 'kanban-board-v1' },
  ),
)

declare global {
  interface Window {
    useBoardStore: typeof useBoardStore
  }
}

if (import.meta.env.DEV) {
  window.useBoardStore = useBoardStore
}