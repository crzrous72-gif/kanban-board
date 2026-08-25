import { useState } from 'react'
import type { FormEvent } from 'react'
import { useBoardStore } from '../../store/useBoardStore'
import { useUiStore } from '../../store/useUiStore'
import { COLORES_COLUMNA } from '../../lib/constants'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

const MAX_TITULO = 40

export function ColumnModal({ columnId }: { columnId?: string }) {
  const column = useBoardStore((s) =>
    columnId ? s.columns.find((c) => c.id === columnId) : undefined,
  )
  const addColumn = useBoardStore((s) => s.addColumn)
  const updateColumn = useBoardStore((s) => s.updateColumn)
  const cerrarModal = useUiStore((s) => s.cerrarModal)

  const [title, setTitle] = useState(column?.title ?? '')
  const [color, setColor] = useState(column?.color ?? 'gris')
  const [error, setError] = useState<string | undefined>(undefined)

  function enviar(e: FormEvent) {
    e.preventDefault()

    const limpio = title.trim()
    if (limpio.length === 0) return setError('El título es obligatorio')
    if (limpio.length > MAX_TITULO) return setError(`Máximo ${MAX_TITULO} caracteres`)

    if (column) updateColumn(column.id, { title: limpio, color })
    else addColumn(limpio)

    cerrarModal()
  }

  return (
    <Modal titulo={column ? 'Editar columna' : 'Nueva columna'} onClose={cerrarModal}>
      <form onSubmit={enviar} className="flex flex-col gap-4">
        <Input
          label="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={error}
          maxLength={MAX_TITULO + 1}
          placeholder="Por revisar"
        />

        {column && (
          <fieldset>
            <legend className="mb-2 text-xs font-medium text-suave">Color del encabezado</legend>
            <div className="flex flex-wrap gap-2">
              {Object.entries(COLORES_COLUMNA).map(([nombre, clase]) => (
                <button
                  key={nombre}
                  type="button"
                  aria-label={`Color ${nombre}`}
                  aria-pressed={color === nombre}
                  onClick={() => setColor(nombre)}
                  className={`size-7 cursor-pointer rounded-full ${clase} ${
                    color === nombre ? 'ring-2 ring-titulo ring-offset-2' : ''
                  }`}
                />
              ))}
            </div>
          </fieldset>
        )}

        <div className="mt-1 flex justify-end gap-2">
          <Button type="button" onClick={cerrarModal}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" className="px-3 py-1.5">
            {column ? 'Guardar cambios' : 'Crear columna'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
