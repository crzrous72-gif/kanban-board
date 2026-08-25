import { create } from 'zustand'

export type ModalAbierto =
  { tipo: 'tarea'; columnId: string; taskId?: string } | { tipo: 'columna'; columnId?: string }

export type Confirmacion = {
  titulo: string
  mensaje: string
  textoConfirmar: string
  onConfirm: () => void
}

interface UiStore {
  modal: ModalAbierto | null
  confirmacion: Confirmacion | null
  abrirModal: (modal: ModalAbierto) => void
  cerrarModal: () => void
  pedirConfirmacion: (confirmacion: Confirmacion) => void
  cerrarConfirmacion: () => void
}

export const useUiStore = create<UiStore>((set) => ({
  modal: null,
  confirmacion: null,
  abrirModal: (modal) => set({ modal }),
  cerrarModal: () => set({ modal: null }),
  pedirConfirmacion: (confirmacion) => set({ confirmacion }),
  cerrarConfirmacion: () => set({ confirmacion: null }),
}))
