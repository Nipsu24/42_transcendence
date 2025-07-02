import React from 'react'
import AnimatedLetters from './AnimatedLetters'

export default function ThePongTitle() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <h1
        className="
          absolute top-[8vh] 
          left-[3vw] sm:left-[5vw]   /* 모바일 3vw, sm 이상 5vw */
          flex items-start
          gap-[0.2vw]
          leading-[1]
        "
      >
        {/* THE */}
        <AnimatedLetters
          text="THE"
          className="
            font-(family-name:--font-body)
            text-[clamp(1rem,5vw,1.8rem)]
            font-light fake-semibold
            tracking-tight
            relative
            top-[clamp(8px,5vw,25px)]
          "
        />

        {/* PO */}
        <AnimatedLetters
          text="PONG"
          baseDelay={0.4}
          className="
            font-(family-name:--font-heading)
            text-[3rem]                /* mobile */
            sm:text-[clamp(3.5rem,15vw,15rem)]
            font-Demy fake-bold
            tracking-[-0.004em]
            uppercase
            leading-[0.95]
          "
        />
      </h1>
    </div>
  )
}
