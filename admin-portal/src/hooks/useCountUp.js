import { useState, useEffect } from 'react'

// Animates a number from 0 to `target` over `duration` ms (ease-out cubic),
// starting after `delay` ms. Returns the current animated value.
export default function useCountUp(target, { duration = 1400, delay = 0 } = {}) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!target) return
    let raf
    const timeout = setTimeout(() => {
      let startTime = null
      raf = requestAnimationFrame(function tick(now) {
        if (startTime === null) startTime = now
        const progress = Math.min((now - startTime) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setValue(eased * target)
        if (progress < 1) raf = requestAnimationFrame(tick)
      })
    }, delay)

    return () => {
      clearTimeout(timeout)
      cancelAnimationFrame(raf)
    }
  }, [target, duration, delay])

  return value
}
