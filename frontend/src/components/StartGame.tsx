type StartGameProps = {
  onClick: () => void;
};

export default function StartGameCallout({ onClick }: StartGameProps) {
  return (
<div className="absolute right-[7vw] top-[clamp(15vh,40vh,50vh)] flex flex-col sm:flex-row items-center gap-4 text-right z-10">
<p className="
	fade-in font-body
	text-[clamp(0.9rem,1.4vw,1.3rem)]
	2xl:text-[1.6rem]
	 text-gray-700 leading-snug max-w-md text-right">
		Get ready for the legendary game of Pong <br className="block sm:block" />
		One click is all it takes to begin
		</p>
      <button
        onClick={onClick}
        className="
		fade-in font-body
		px-6 py-2 
		xl:px-8 xl:py-2.3
		2xl:text-[1.7rem]
		2xl:px-9
		border border-gray-700 text-gray-700 bg-white
		hover:bg-gray-700 hover:text-white
		xl:text-lg 
		transition rounded 
		self-end
		sm:self-auto"
      >
        Start Game
      </button>
    </div>
  );
}

