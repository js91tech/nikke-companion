import { useState } from 'react'

interface Props {
  src?: string
  name: string
  size?: number
  className?: string
}

/** Prydwen CDN portrait with local placeholder fallback. */
export function Portrait({ src, name, size = 40, className = '' }: Props) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) {
    return (
      <span
        className={`portrait portrait-fallback ${className}`}
        style={{ width: size, height: size }}
        aria-hidden
      >
        {name.slice(0, 1).toUpperCase()}
      </span>
    )
  }
  return (
    <img
      className={`portrait ${className}`}
      src={src}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  )
}
