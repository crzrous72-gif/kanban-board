import type { Task } from '../../types'
import { formatearFecha } from '../../lib/utils'
import { Badge } from '../ui/Badge'

const PRIORIDAD = {
  low: { tono: 'baja', texto: 'Baja' },
  medium: { tono: 'media', texto: 'Media' },
  high: { tono: 'alta', texto: 'Alta' },
} as const

type TaskCardProps = {
  task: Task
  onEditar: () => void
}

export function TaskCard({ task, onEditar }: TaskCardProps) {
  const prioridad = PRIORIDAD[task.priority]

  return (
    <article className="rounded-lg border border-borde bg-tarjeta shadow-sm transition hover:border-suave">
      <button
        type="button"
        onClick={onEditar}
        aria-label={`Editar ${task.title}`}
        className="w-full cursor-pointer p-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-titulo"
      >
        <h3 className="text-sm font-medium text-titulo">{task.title}</h3>

        {task.description && (
          <p className="mt-1 line-clamp-2 text-xs text-suave">{task.description}</p>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <Badge tone={prioridad.tono}>{prioridad.texto}</Badge>
          {task.labels.map((label) => (
            <Badge key={label}>{label}</Badge>
          ))}
        </div>

        {task.dueDate && (
          <p className="mt-2 text-xs text-suave">Vence el {formatearFecha(task.dueDate)}</p>
        )}
      </button>
    </article>
  )
}
