import React from 'react'
import AnimatedLetters from './AnimatedLetters'

export default function ThePongTitle(){
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <h1 className="absolute top-[10vh] sm:top-[8vh] left-[3vw] sm:left-[5vw] flex items-start gap-1 sm:gap-[0.2vw] leading-none">
        <AnimatedLetters
          text="THE"
          className="
            font-(family-name:--font-body)
            text-[1.2rem] sm:text-[clamp(1rem,5vw,1.8rem)]
            font-light
            fake-semibold
            tracking-tight
            relative top-[8px] sm:top-[clamp(8px,5vw,25px)]
          "
        />
        <AnimatedLetters
          text="PONG"
          baseDelay={0.4}
          className="
            font-(family-name:--font-heading)
            text-[5rem] sm:text-[clamp(3.5rem,15vw,15rem)]
            font-demy
			fake-bold
            tracking-wider sm:tracking-[-0.002em]
            uppercase leading-[0.95]
          "
        />
      </h1>
    </div>
  )
}
