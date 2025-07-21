import React, { useEffect, useRef, useState } from 'react'

export default function DominoGrid(){
// Explicitly specify row number and domino count types
  const rows: number[] = [0, 1]
  const count: number = 28

// Specify HTMLDivElement or null type for the 2D array ref
  const dominoRefs = useRef<(HTMLDivElement | null)[][]>(
    Array.from({ length: 2 }, () => Array(count).fill(null))
  )

// Specify generic type for the ball position state
  const [ballPosition, setBallPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  })
// Active domino color map
  const [active, setActive] = useState<Record<string, string>>({})

  const colorsTop = ['domino-blue-light', 'domino-sky-blue', 'domino-blue']
  const colorsBottom = ['domino-yellow-light', 'domino-yellow', 'domino-orange']

// Specify number type for interval ID used to update ball position
  useEffect(() => {
    const interval: number = window.setInterval(() => {
      const ball = document.getElementById('moving-ball')
      if (ball) {
        const rect = ball.getBoundingClientRect()
        setBallPosition({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        })
      }
    }, 100)
    return () => clearInterval(interval)
  }, [])

// Domino reaction logic
  useEffect(() => {
    rows.forEach((row) => {
      for (let i = 0; i < count; i++) {
        const el = dominoRefs.current[row]?.[i]
        if (!el) continue

        const rect = el.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const distance = Math.hypot(cx - ballPosition.x, cy - ballPosition.y)

        const key = `${row}-${i}`

        if (distance < 70 && !active[key]) {
          const colorSet = row === 1 ? colorsTop : colorsBottom
          const color = colorSet[Math.floor(Math.random() * colorSet.length)]
          setActive((prev) => ({ ...prev, [key]: color }))

          setTimeout(() => {
            setActive((prev) => {
              const copy = { ...prev }
              delete copy[key]
              return copy
            })
          }, 700)
        }
      }
    })
  }, [ballPosition, rows, count, colorsTop, colorsBottom, active])

  return (
    <div className="absolute bottom-[clamp(4vh,6vh,8vh)] w-full flex justify-center z-10">
      <div className="w-[90.5vw] mx-auto px-[clamp(0.5rem,2vw,2rem)] flex flex-col items-center gap-4">
        {rows.map((row) => (
          <div
            key={row}
            className="flex justify-between w-full gap-[clamp(0.25rem,1.2vw,1.6rem)]"
          >
            {Array.from({ length: count }).map((_, i) => {
              const key = `${row}-${i}`
              const colorClass = active[key] || ''
              const baseClass = `domino-bar bg-gray-100 ${colorClass}`
              const tiltClass = active[key] ? 'tilt' : ''
              const animClass =
                row === 1 ? 'animate-domino-top' : 'animate-domino-bottom'

              return (
                <div
                  key={key}
                  ref={(el) => {
                    dominoRefs.current[row][i] = el
                  }}
                  className={`${baseClass} ${tiltClass} ${animClass}`}
                  style={{ animationDelay: `${i * 0.3 + row * 1.2}s` }}
                />
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

