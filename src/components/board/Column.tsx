import { useDroppable } from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Plus } from 'lucide-react'
import { useBoardStore } from '../../store/useBoardStore'
import { useUiStore } from '../../store/useUiStore'
import { Button } from '../ui/Button'
import { ColumnHeader } from './ColumnHeader'
import { TaskCard } from './TaskCard'

export function Column({ columnId }: { columnId: string }) {
  const column = useBoardStore((s) => s.columns.find((c) => c.id === columnId))
  const tasks = useBoardStore((s) => s.tasks)
  const abrirModal = useUiStore((s) => s.abrirModal)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: columnId,
    data: { tipo: 'columna' },
  })

  const { setNodeRef: setZonaRef, isOver } = useDroppable({
    id: `zona-${columnId}`,
    data: { tipo: 'zona', columnId },
  })

  if (!column) return null

  const tareas = tasks.filter((t) => t.columnId === columnId).sort((a, b) => a.order - b.order)

  return (
    <section
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex w-72 shrink-0 snap-start flex-col rounded-xl p-3 transition-colors sm:w-80 ${
        isOver ? 'bg-borde' : 'bg-columna'
      } ${isDragging ? 'opacity-50' : ''}`}
    >
      <ColumnHeader
        columnId={column.id}
        title={column.title}
        color={column.color}
        count={tareas.length}
        arrastre={{ attributes, listeners }}
      />

      <div ref={setZonaRef} className="min-h-16">
        <SortableContext items={tareas.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tareas.length === 0 ? (
            <button
              type="button"
              onClick={() => abrirModal({ tipo: 'tarea', columnId })}
              className="w-full cursor-pointer rounded-lg border border-dashed border-borde px-3 py-8 text-center text-xs text-suave transition hover:border-suave hover:text-titulo"
            >
              Sin tareas todavía. Agrega la primera.
            </button>
          ) : (
            <ul className="flex flex-col gap-2">
              {tareas.map((task) => (
                <li key={task.id}>
                  <TaskCard
                    task={task}
                    onEditar={() => abrirModal({ tipo: 'tarea', columnId, taskId: task.id })}
                  />
                </li>
              ))}
            </ul>
          )}
        </SortableContext>
      </div>

      {tareas.length > 0 && (
        <Button
          className="mt-2 justify-start"
          onClick={() => abrirModal({ tipo: 'tarea', columnId })}
        >
          <Plus size={14} aria-hidden="true" />
          Agregar tarea
        </Button>
      )}
    </section>
  )
}
