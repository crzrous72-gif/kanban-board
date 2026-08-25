import { useEffect, useRef, useState } from 'react'
import { EllipsisVertical, Pencil, Plus, Trash2 } from 'lucide-react'
import { useBoardStore } from '../../store/useBoardStore'
import { useUiStore } from '../../store/useUiStore'
import { COLORES_COLUMNA } from '../../lib/constants'
import { Button } from '../ui/Button'

type ColumnHeaderProps = {
  columnId: string
  title: string
  color?: string
  count: number
}

export function ColumnHeader({ columnId, title, color, count }: ColumnHeaderProps) {
  const deleteColumn = useBoardStore((s) => s.deleteColumn)
  const abrirModal = useUiStore((s) => s.abrirModal)
  const pedirConfirmacion = useUiStore((s) => s.pedirConfirmacion)

  const [menuAbierto, setMenuAbierto] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuAbierto) return

    function alClicar(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuAbierto(false)
    }
    function alPulsar(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuAbierto(false)
    }

    document.addEventListener('mousedown', alClicar)
    document.addEventListener('keydown', alPulsar)
    return () => {
      document.removeEventListener('mousedown', alClicar)
      document.removeEventListener('keydown', alPulsar)
    }
  }, [menuAbierto])

  const claseColor = COLORES_COLUMNA[color as keyof typeof COLORES_COLUMNA] ?? COLORES_COLUMNA.gris

  function eliminar() {
    setMenuAbierto(false)
    pedirConfirmacion({
      titulo: 'Eliminar columna',
      mensaje:
        count === 0
          ? `Se eliminará la columna «${title}».`
          : `Se eliminará la columna «${title}» y ${count === 1 ? 'su única tarea' : `sus ${count} tareas`}. Esta acción no se puede deshacer.`,
      textoConfirmar: 'Eliminar',
      onConfirm: () => deleteColumn(columnId),
    })
  }

  return (
    <header className="flex items-center justify-between gap-2 px-1 pb-3">
      <div className="flex min-w-0 items-center gap-2">
        <span className={`size-2.5 shrink-0 rounded-full ${claseColor}`} aria-hidden="true" />
        <h2 className="truncate text-sm font-semibold text-titulo">{title}</h2>
        <span className="shrink-0 rounded-full bg-borde px-2 py-0.5 text-xs font-medium text-suave">
          {count}
        </span>
      </div>

      <div className="flex shrink-0 items-center">
        <Button
          aria-label={`Agregar tarea a ${title}`}
          onClick={() => abrirModal({ tipo: 'tarea', columnId })}
        >
          <Plus size={16} aria-hidden="true" />
        </Button>

        <div className="relative" ref={menuRef}>
          <Button
            aria-label={`Opciones de ${title}`}
            aria-expanded={menuAbierto}
            aria-haspopup="menu"
            onClick={() => setMenuAbierto((v) => !v)}
          >
            <EllipsisVertical size={16} aria-hidden="true" />
          </Button>

          {menuAbierto && (
            <div
              role="menu"
              className="absolute right-0 z-20 mt-1 w-48 overflow-hidden rounded-lg border border-borde bg-tarjeta py-1 shadow-lg"
            >
              <button
                role="menuitem"
                type="button"
                className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm text-titulo hover:bg-columna"
                onClick={() => {
                  setMenuAbierto(false)
                  abrirModal({ tipo: 'columna', columnId })
                }}
              >
                <Pencil size={14} aria-hidden="true" />
                Renombrar y color
              </button>

              <button
                role="menuitem"
                type="button"
                className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm text-alta hover:bg-alta-suave"
                onClick={eliminar}
              >
                <Trash2 size={14} aria-hidden="true" />
                Eliminar columna
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
