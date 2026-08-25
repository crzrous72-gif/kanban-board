import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Pencil } from 'lucide-react'
import type { Task } from '../../types'
import { formatearFecha } from '../../lib/utils'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'

const PRIORIDAD = {
  low: { tono: 'baja', texto: 'Baja' },
  medium: { tono: 'media', texto: 'Media' },
  high: { tono: 'alta', texto: 'Alta' },
} as const

type VistaProps = {
  task: Task
  onEditar?: () => void
  sombra?: boolean
}

export function TaskCardVista({ task, onEditar, sombra = false }: VistaProps) {
  const prioridad = PRIORIDAD[task.priority]

  return (
    <div
      className={`rounded-lg border border-borde bg-tarjeta p-3 transition ${
        sombra ? 'rotate-2 shadow-lg' : 'shadow-sm hover:border-suave'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-medium text-titulo">{task.title}</h3>
        {onEditar && (
          <Button
            aria-label={`Editar ${task.title}`}
            className="shrink-0"
            onPointerDown={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            onClick={onEditar}
          >
            <Pencil size={14} aria-hidden="true" />
          </Button>
        )}
      </div>

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
    </div>
  )
}

type TaskCardProps = {
  task: Task
  onEditar: () => void
}

export function TaskCard({ task, onEditar }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { tipo: 'tarea' },
  })

  return (
    <article
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`cursor-grab touch-none rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-titulo ${
        isDragging ? 'opacity-40' : ''
      }`}
      {...attributes}
      {...listeners}
    >
      <TaskCardVista task={task} onEditar={onEditar} />
    </article>
  )
}
