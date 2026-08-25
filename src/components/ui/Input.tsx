import { useId } from 'react'
import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'

const BASE =
  'w-full rounded-lg border border-borde bg-tarjeta px-3 py-2 text-sm text-titulo outline-none focus:border-titulo'

type Comun = { label: string; error?: string; ayuda?: string }

function Envoltura({
  id,
  label,
  error,
  ayuda,
  children,
}: Comun & { id: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-medium text-suave">
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1 text-xs font-medium text-alta">{error}</p>
      ) : ayuda ? (
        <p className="mt-1 text-xs text-suave">{ayuda}</p>
      ) : null}
    </div>
  )
}

export function Input({
  label,
  error,
  ayuda,
  ...props
}: Comun & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId()
  return (
    <Envoltura id={id} label={label} error={error} ayuda={ayuda}>
      <input id={id} className={BASE} aria-invalid={Boolean(error)} {...props} />
    </Envoltura>
  )
}

export function Textarea({
  label,
  error,
  ayuda,
  ...props
}: Comun & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId()
  return (
    <Envoltura id={id} label={label} error={error} ayuda={ayuda}>
      <textarea id={id} rows={3} className={BASE} aria-invalid={Boolean(error)} {...props} />
    </Envoltura>
  )
}

export function Select({
  label,
  error,
  ayuda,
  children,
  ...props
}: Comun & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId()
  return (
    <Envoltura id={id} label={label} error={error} ayuda={ayuda}>
      <select id={id} className={BASE} {...props}>
        {children}
      </select>
    </Envoltura>
  )
}
