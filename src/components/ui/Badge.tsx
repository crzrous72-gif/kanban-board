import type { ReactNode } from 'react'

type BadgeProps = {
  children: ReactNode
  tone?: 'neutral' | 'baja' | 'media' | 'alta'
}

const TONOS = {
  neutral: 'bg-baja-suave text-suave',
  baja: 'bg-baja-suave text-baja',
  media: 'bg-media-suave text-media',
  alta: 'bg-alta-suave text-alta',
}

export function Badge({ children, tone = 'neutral' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${TONOS[tone]}`}
    >
      {children}
    </span>
  )
}
