import { Board } from './components/board/Board'
import { ColumnModal } from './components/modals/ColumnModal'
import { ConfirmDialog } from './components/modals/ConfirmDialog'
import { TaskModal } from './components/modals/TaskModal'
import { useUiStore } from './store/useUiStore'

function App() {
  const modal = useUiStore((s) => s.modal)

  return (
    <div className="min-h-screen bg-tablero">
      <header className="px-4 pt-6 pb-4">
        <h1 className="text-xl font-semibold text-titulo">Kanban Board</h1>
        <p className="text-sm text-suave">Tablero de tareas</p>
      </header>

      <Board />

      {modal?.tipo === 'tarea' && <TaskModal columnId={modal.columnId} taskId={modal.taskId} />}
      {modal?.tipo === 'columna' && <ColumnModal columnId={modal.columnId} />}

      <ConfirmDialog />
    </div>
  )
}

export default App
