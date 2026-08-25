import { Plus } from 'lucide-react'
import { useBoardStore } from '../../store/useBoardStore'
import { useUiStore } from '../../store/useUiStore'
import { Column } from './Column'

export function Board() {
  const columns = useBoardStore((s) => s.columns)
  const abrirModal = useUiStore((s) => s.abrirModal)

  const ordenadas = [...columns].sort((a, b) => a.order - b.order)

  return (
    <div className="flex snap-x snap-mandatory items-start gap-4 overflow-x-auto px-4 pb-8 sm:snap-none">
      {ordenadas.map((column) => (
        <Column key={column.id} columnId={column.id} />
      ))}

      <button
        type="button"
        onClick={() => abrirModal({ tipo: 'columna' })}
        className="flex w-72 shrink-0 snap-start cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-borde px-3 py-6 text-sm font-medium text-suave transition hover:border-suave hover:text-titulo sm:w-80"
      >
        <Plus size={16} aria-hidden="true" />
        Agregar columna
      </button>
    </div>
  )
}
