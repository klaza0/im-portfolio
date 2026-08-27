interface IconDisplayProps {
  icon: string
  className?: string
  imgClassName?: string
}

export function IconDisplay({ icon, className = '', imgClassName }: IconDisplayProps) {
  const value = icon ?? '❓'

  if (value.startsWith('/')) {
    return (
      <img
        src={value}
        alt=""
        className={imgClassName ?? className}
        draggable={false}
      />
    )
  }

  return <span className={className}>{value}</span>
}
