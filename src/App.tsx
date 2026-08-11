import { useBoardStore } from './store/useBoardStore'

function App() {
  const columns = useBoardStore((s) => s.columns)

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100">
      <h1 className="text-3xl font-bold text-red-500">
        Kanban Board — {columns.length} {columns.length === 1 ? 'columna' : 'columnas'}
      </h1>
    </main>
  )
}

export default App