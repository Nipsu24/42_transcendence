import React, { useEffect, useRef } from 'react';

export default function BackgroundBall() {
  const ballRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateBounceHeight = () => {
      const height = window.innerHeight;
      const max = height * 0.98 - 16; // -16px safety margin
      if (ballRef.current) {
        ballRef.current.style.setProperty('--ball-bounce-max', `${max}px`);
      }
    };

    updateBounceHeight();
    window.addEventListener('resize', updateBounceHeight);
    return () => window.removeEventListener('resize', updateBounceHeight);
  }, []);

  return (
    <div className="absolute inset-0 z-[0] pointer-events-none">
      <div
        id="moving-ball"
        ref={ballRef}
        className="absolute w-4 h-4 rounded-full bg-black shadow-md animate-zigzag-bounce"
      />
    </div>
  );
}

  
  
  
  

