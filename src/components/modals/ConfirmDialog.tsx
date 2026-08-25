import { useUiStore } from '../../store/useUiStore'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'

export function ConfirmDialog() {
  const confirmacion = useUiStore((s) => s.confirmacion)
  const cerrar = useUiStore((s) => s.cerrarConfirmacion)

  if (!confirmacion) return null

  return (
    <Modal titulo={confirmacion.titulo} onClose={cerrar}>
      <p className="text-sm text-suave">{confirmacion.mensaje}</p>

      <div className="mt-5 flex justify-end gap-2">
        <Button type="button" onClick={cerrar}>
          Cancelar
        </Button>
        <Button
          type="button"
          variant="peligro"
          className="px-3 py-1.5"
          onClick={() => {
            confirmacion.onConfirm()
            cerrar()
          }}
        >
          {confirmacion.textoConfirmar}
        </Button>
      </div>
    </Modal>
  )
}
