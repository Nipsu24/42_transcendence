type AnimatedLettersProps = {
  text: string;
  baseDelay?: number;
  className?: string;
};

export default function AnimatedLetters({ text, baseDelay = 0, className = '' }: AnimatedLettersProps) {
  return (
    <>
      {[...text].map((char, i) => (
        <span
          key={`${text}-${i}`}
          className={`inline-block opacity-0 animate-text-fade ${className}`}
          style={{ animationDelay: `${(baseDelay + i * 0.15).toFixed(2)}s` }}
        >
          {char}
        </span>
      ))}
    </>
  );
}
