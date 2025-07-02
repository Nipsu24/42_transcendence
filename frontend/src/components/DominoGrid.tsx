import React, { useEffect, useRef, useState } from 'react';

export default function DominoGrid() {
  const rows = [0, 1];
  const count = 28; 

  // ✅ 도미노 DOM 참조용
  const dominoRefs = useRef<(HTMLDivElement | null)[][]>(
    Array.from({ length: 2 }, () => Array(count).fill(null))
  );

  const [ballPosition, setBallPosition] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState<{ [key: string]: string }>({});

  const colorsTop = ['domino-blue-light', 'domino-sky-blue', 'domino-blue'];
  const colorsBottom = ['domino-yellow-light', 'domino-yellow', 'domino-orange'];

  // 공 위치 추적
  useEffect(() => {
    const interval = setInterval(() => {
      const ball = document.getElementById('moving-ball');
      if (ball) {
        const rect = ball.getBoundingClientRect();
        setBallPosition({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        });
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // 도미노 반응
  useEffect(() => {
    rows.forEach((row) => {
      for (let i = 0; i < count; i++) {
        const el = dominoRefs.current[row]?.[i];
        if (!el) continue;

        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const distance = Math.sqrt((cx - ballPosition.x) ** 2 + (cy - ballPosition.y) ** 2);

        const key = `${row}-${i}`;

        if (distance < 70 && !active[key]) {
          const colorSet = row === 1 ? colorsTop : colorsBottom;
          const color = colorSet[Math.floor(Math.random() * colorSet.length)];
          setActive((prev) => ({ ...prev, [key]: color }));

          setTimeout(() => {
            setActive((prev) => {
              const copy = { ...prev };
              delete copy[key];
              return copy;
            });
          }, 700);
        }
      }
    });
  }, [ballPosition]);

  return (
    <div className="absolute bottom-[clamp(4vh,6vh,8vh)] w-full flex justify-center z-10">
      <div className="w-[90.5vw] mx-auto px-[clamp(0.5rem,2vw,2rem)] flex flex-col items-center gap-4">

        {rows.map((row) => (
         <div key={row} className="flex justify-between w-full gap-[clamp(0.25rem,1.2vw,1.6rem)]">
            {Array.from({ length: count }).map((_, i) => {
              const key = `${row}-${i}`;
              const colorClass = active[key] || '';
              const baseClass = `domino-bar bg-gray-100 ${colorClass}`;
              const tiltClass = active[key] ? 'tilt' : '';
              const animClass = row === 1 ? 'animate-domino-top' : 'animate-domino-bottom';

              return (
				<div
				key={i}
				ref={(el) => {
					if (!dominoRefs.current[row]) dominoRefs.current[row] = [];
					dominoRefs.current[row][i] = el;
				}}
				className={`${baseClass} ${tiltClass} ${animClass}`}
				style={{ animationDelay: `${i * 0.3 + row * 1.2}s` }}
				/>

              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
