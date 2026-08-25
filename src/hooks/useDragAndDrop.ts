import { useState } from 'react'
import { KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { useBoardStore } from '../store/useBoardStore'

export type Arrastrado = { tipo: 'tarea' | 'columna'; id: string } | null

export function useDragAndDrop() {
  const tasks = useBoardStore((s) => s.tasks)
  const columns = useBoardStore((s) => s.columns)
  const moveTask = useBoardStore((s) => s.moveTask)
  const reorderColumns = useBoardStore((s) => s.reorderColumns)

  const [arrastrado, setArrastrado] = useState<Arrastrado>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  // Las zonas de soltar de cada columna se registran como "zona-<id>"
  function normalizar(id: string): string {
    return id.startsWith('zona-') ? id.slice('zona-'.length) : id
  }

  function columnaDe(id: string): string | null {
    if (columns.some((c) => c.id === id)) return id
    return tasks.find((t) => t.id === id)?.columnId ?? null
  }

  function tareasDe(columnId: string) {
    return tasks.filter((t) => t.columnId === columnId).sort((a, b) => a.order - b.order)
  }

  function indiceDestino(columnId: string, overId: string): number {
    const enColumna = tareasDe(columnId)
    const indice = enColumna.findIndex((t) => t.id === overId)
    return indice === -1 ? enColumna.length : indice
  }

  function onDragStart(evento: DragStartEvent) {
    const tipo = evento.active.data.current?.tipo === 'columna' ? 'columna' : 'tarea'
    setArrastrado({ tipo, id: String(evento.active.id) })
  }

  function onDragOver(evento: DragOverEvent) {
    const { active, over } = evento
    if (!over || active.data.current?.tipo !== 'tarea') return

    const activeId = String(active.id)
    const overId = normalizar(String(over.id))
    if (activeId === overId) return

    const origen = tasks.find((t) => t.id === activeId)?.columnId
    const destino = columnaDe(overId)
    if (!origen || !destino || origen === destino) return

    moveTask(activeId, destino, indiceDestino(destino, overId))
  }

  function onDragEnd(evento: DragEndEvent) {
    const { active, over } = evento
    setArrastrado(null)
    if (!over) return

    const activeId = String(active.id)
    const overId = normalizar(String(over.id))

    if (active.data.current?.tipo === 'columna') {
      // Al soltar sobre otra columna, `over` puede ser la columna, su zona o una de sus tareas
      const columnaDestino = columnaDe(overId)
      if (!columnaDestino || columnaDestino === activeId) return

      const ordenadas = [...columns].sort((a, b) => a.order - b.order)
      const desde = ordenadas.findIndex((c) => c.id === activeId)
      const hasta = ordenadas.findIndex((c) => c.id === columnaDestino)
      if (desde === -1 || hasta === -1) return

      return reorderColumns(desde, hasta)
    }

    const destino = columnaDe(overId)
    if (!destino) return

    const indice = indiceDestino(destino, overId)
    const tarea = tasks.find((t) => t.id === activeId)
    if (tarea && tarea.columnId === destino && tarea.order === indice) return

    moveTask(activeId, destino, indice)
  }

  function onDragCancel() {
    setArrastrado(null)
  }

  return { sensors, arrastrado, onDragStart, onDragOver, onDragEnd, onDragCancel }
}
