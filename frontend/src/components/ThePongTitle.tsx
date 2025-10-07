import AnimatedLetters from './AnimatedLetters'

export default function ThePongTitle(){
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <h1 className="absolute top-[10vh] sm:top-[8vh] left-[3vw] sm:left-[5vw] flex items-start gap-1 sm:gap-[0.2vw] leading-none">
        <AnimatedLetters
          text="THE"
          className="
            font-body
            text-[1.2rem] 
			sm:text-[clamp(1.2rem,2vw,1.8rem)]
			title-the-lg
			title-the-xl
			title-the-2xl
			title-the-3xl
			title-the-4xl
            font-light
			text-stroke
			[--stroke-width:2.5px]
            tracking-normal
            relative top-[8px] sm:top-[clamp(8px,2vw,40px)]
          "
        />
        <AnimatedLetters
          text="PONG"
          baseDelay={0.4}
          className="
            font-heading
            text-[5rem] 
			sm:text-[clamp(4rem,16vw,9rem)]
			title-pong-lg
			title-pong-xl
			title-pong-2xl
			title-pong-3xl
            title-pong-4xl
			text-stroke
    		[--stroke-width:8px]
            tracking-normal
            uppercase leading-[0.95]
          "
        />
      </h1>
    </div>
  )
}

