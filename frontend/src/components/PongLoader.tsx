export default function PongLoader() {
  return (
    <div
      className="flex flex-col items-center justify-center h-screen bg-[#fffffe] text-black gap-6"
      aria-busy="true"
    >
      {/* Paddle + Ball */}
      <div className="flex items-center gap-8">
        <div className="w-[0.5rem] h-[3rem] bg-black animate-paddle" />
        <div className="w-[1rem] h-[1rem] rounded-full bg-black animate-ball shadow-xl" />
        <div
          className="w-[0.5rem] h-[3rem] bg-black animate-paddle"
          style={{ animationDelay: '0.2s' }}
        />
      </div>

      {/* P O N G text animation */}
      <div className="font-heading flex text-[clamp(1.5rem,3vw,2rem)] font-bold tracking-widest">
        {['P', 'O', 'N', 'G'].map((char, i) => (
          <span
            key={i}
            className="opacity-0 animate-text-fade"
            style={{ animationDelay: `${i * 0.2}s` }}
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  );
}
