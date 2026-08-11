# Kanban Board

Tablero Kanban para gestionar tareas en columnas, con arrastrar y soltar.
El estado se guarda en el navegador; no hay backend.

## Stack

- Vite + React 18 + TypeScript
- TailwindCSS v4
- Zustand (estado global, con persistencia en localStorage)
- dnd-kit (drag & drop accesible)
- lucide-react (iconos)

## Cómo correr en local

```bash
npm install
npm run dev
```

La app queda en http://localhost:5173

## Scripts

| Comando          | Qué hace                    |
| ---------------- | --------------------------- |
| `npm run dev`    | Servidor de desarrollo      |
| `npm run build`  | Compila para producción     |
| `npm run lint`   | Revisa el código con ESLint |
| `npm run format` | Formatea con Prettier       |

kanban-board-rous1.vercel.app