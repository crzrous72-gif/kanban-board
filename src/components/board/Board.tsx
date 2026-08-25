import { DndContext, DragOverlay, closestCorners } from '@dnd-kit/core'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import { useBoardStore } from '../../store/useBoardStore'
import { useUiStore } from '../../store/useUiStore'
import { useDragAndDrop } from '../../hooks/useDragAndDrop'
import { Column } from './Column'
import { TaskCardVista } from './TaskCard'

export function Board() {
  const columns = useBoardStore((s) => s.columns)
  const tasks = useBoardStore((s) => s.tasks)
  const abrirModal = useUiStore((s) => s.abrirModal)

  const { sensors, arrastrado, onDragStart, onDragOver, onDragEnd, onDragCancel } = useDragAndDrop()

  const ordenadas = [...columns].sort((a, b) => a.order - b.order)

  const tareaArrastrada =
    arrastrado?.tipo === 'tarea' ? tasks.find((t) => t.id === arrastrado.id) : undefined
  const columnaArrastrada =
    arrastrado?.tipo === 'columna' ? columns.find((c) => c.id === arrastrado.id) : undefined

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
    >
      <div className="flex snap-x snap-mandatory items-start gap-4 overflow-x-auto px-4 pb-8 sm:snap-none">
        <SortableContext
          items={ordenadas.map((c) => c.id)}
          strategy={horizontalListSortingStrategy}
        >
          {ordenadas.map((column) => (
            <Column key={column.id} columnId={column.id} />
          ))}
        </SortableContext>

        <button
          type="button"
          onClick={() => abrirModal({ tipo: 'columna' })}
          className="flex w-72 shrink-0 snap-start cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-borde px-3 py-6 text-sm font-medium text-suave transition hover:border-suave hover:text-titulo sm:w-80"
        >
          <Plus size={16} aria-hidden="true" />
          Agregar columna
        </button>
      </div>

      <DragOverlay>
        {tareaArrastrada && (
          <div className="w-72 sm:w-80">
            <TaskCardVista task={tareaArrastrada} sombra />
          </div>
        )}
        {columnaArrastrada && (
          <div className="w-72 rotate-1 rounded-xl bg-columna p-3 shadow-lg sm:w-80">
            <p className="text-sm font-semibold text-titulo">{columnaArrastrada.title}</p>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
