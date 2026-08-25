import type { ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'peligro'
}

const VARIANTES = {
  primary: 'bg-titulo text-white hover:opacity-90',
  ghost: 'text-suave hover:bg-borde',
  peligro: 'bg-alta text-white hover:opacity-90',
}

export function Button({ variant = 'ghost', className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex cursor-pointer items-center justify-center gap-1 rounded-md px-2 py-1 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-titulo ${VARIANTES[variant]} ${className}`}
      {...props}
    />
  )
}
