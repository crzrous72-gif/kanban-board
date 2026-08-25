import { useState } from 'react'
import type { FormEvent } from 'react'
import { Trash2 } from 'lucide-react'
import { useBoardStore } from '../../store/useBoardStore'
import { useUiStore } from '../../store/useUiStore'
import type { Priority } from '../../types'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Input, Select, Textarea } from '../ui/Input'

const MAX_TITULO = 100
const MAX_DESCRIPCION = 500

type TaskModalProps = {
  columnId: string
  taskId?: string
}

export function TaskModal({ columnId, taskId }: TaskModalProps) {
  const task = useBoardStore((s) => (taskId ? s.tasks.find((t) => t.id === taskId) : undefined))
  const addTask = useBoardStore((s) => s.addTask)
  const updateTask = useBoardStore((s) => s.updateTask)
  const deleteTask = useBoardStore((s) => s.deleteTask)
  const cerrarModal = useUiStore((s) => s.cerrarModal)
  const pedirConfirmacion = useUiStore((s) => s.pedirConfirmacion)

  const [title, setTitle] = useState(task?.title ?? '')
  const [description, setDescription] = useState(task?.description ?? '')
  const [priority, setPriority] = useState<Priority>(task?.priority ?? 'medium')
  const [labels, setLabels] = useState((task?.labels ?? []).join(', '))
  const [dueDate, setDueDate] = useState(task?.dueDate ?? '')
  const [errores, setErrores] = useState<{ title?: string; description?: string }>({})

  const hoy = new Date().toISOString().slice(0, 10)
  const fechaPasada = dueDate !== '' && dueDate < hoy

  function enviar(e: FormEvent) {
    e.preventDefault()

    const nuevos: { title?: string; description?: string } = {}
    if (title.trim().length === 0) nuevos.title = 'El título es obligatorio'
    else if (title.trim().length > MAX_TITULO) nuevos.title = `Máximo ${MAX_TITULO} caracteres`
    if (description.length > MAX_DESCRIPCION)
      nuevos.description = `Máximo ${MAX_DESCRIPCION} caracteres`

    setErrores(nuevos)
    if (Object.keys(nuevos).length > 0) return

    const datos = {
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      labels: labels
        .split(',')
        .map((l) => l.trim())
        .filter(Boolean),
      dueDate: dueDate || undefined,
    }

    if (task) updateTask(task.id, datos)
    else addTask(columnId, datos)

    cerrarModal()
  }

  function eliminar() {
    if (!task) return
    pedirConfirmacion({
      titulo: 'Eliminar tarea',
      mensaje: `Se eliminará «${task.title}». Esta acción no se puede deshacer.`,
      textoConfirmar: 'Eliminar',
      onConfirm: () => {
        deleteTask(task.id)
        cerrarModal()
      },
    })
  }

  return (
    <Modal titulo={task ? 'Editar tarea' : 'Nueva tarea'} onClose={cerrarModal}>
      <form onSubmit={enviar} className="flex flex-col gap-4">
        <Input
          label="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={errores.title}
          maxLength={MAX_TITULO + 1}
          placeholder="¿Qué hay que hacer?"
        />

        <Textarea
          label="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={errores.description}
          ayuda={`${description.length} de ${MAX_DESCRIPCION} caracteres`}
          placeholder="Opcional"
        />

        <Select
          label="Prioridad"
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
        >
          <option value="low">Baja</option>
          <option value="medium">Media</option>
          <option value="high">Alta</option>
        </Select>

        <Input
          label="Etiquetas"
          value={labels}
          onChange={(e) => setLabels(e.target.value)}
          ayuda="Sepáralas con comas: bug, frontend"
          placeholder="bug, frontend"
        />

        <Input
          label="Fecha de vencimiento"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          ayuda={fechaPasada ? 'Esta fecha ya pasó' : undefined}
        />

        <div className="mt-1 flex items-center justify-between gap-2">
          {task ? (
            <Button type="button" onClick={eliminar} className="text-alta hover:bg-alta-suave">
              <Trash2 size={16} aria-hidden="true" />
              Eliminar
            </Button>
          ) : (
            <span />
          )}

          <div className="flex gap-2">
            <Button type="button" onClick={cerrarModal}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" className="px-3 py-1.5">
              {task ? 'Guardar cambios' : 'Crear tarea'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}
