import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { BoardState, Column } from '../types'
import { DEFAULT_COLUMNS } from '../lib/constants'

interface BoardStore extends BoardState {
  addColumn: (title: string) => void
  updateColumn: (id: string, patch: Partial<Column>) => void
  deleteColumn: (id: string) => void
  reorderColumns: (fromIndex: number, toIndex: number) => void
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