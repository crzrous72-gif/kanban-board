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

  if (!column) return null

  const tareas = tasks.filter((t) => t.columnId === columnId).sort((a, b) => a.order - b.order)

  return (
    <section className="flex w-72 shrink-0 snap-start flex-col rounded-xl bg-columna p-3 sm:w-80">
      <ColumnHeader
        columnId={column.id}
        title={column.title}
        color={column.color}
        count={tareas.length}
      />

      {tareas.length === 0 ? (
        <button
          type="button"
          onClick={() => abrirModal({ tipo: 'tarea', columnId })}
          className="cursor-pointer rounded-lg border border-dashed border-borde px-3 py-8 text-center text-xs text-suave transition hover:border-suave hover:text-titulo"
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
