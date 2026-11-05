import { useCallback, useEffect, useRef, useState } from 'react'

/** Short-lived status message that auto-clears. */
export function useFlash(ms = 2800) {
  const [msg, setMsg] = useState('')
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const flash = useCallback(
    (text: string) => {
      setMsg(text)
      if (timer.current) clearTimeout(timer.current)
      if (!text) return
      timer.current = setTimeout(() => setMsg(''), ms)
    },
    [ms],
  )

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    [],
  )

  return [msg, flash] as const
}
