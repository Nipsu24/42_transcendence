import React, { useEffect, useRef } from 'react';

export default function BackgroundBall() {
  const ballRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const updateBounceHeight = (): void => {
      const height: number = window.innerHeight;
      const max: number = height * 0.98 - 16; // -16px safety margin
      if (ballRef.current) {
        ballRef.current.style.setProperty('--ball-bounce-max', `${max}px`);
      }
    };

    updateBounceHeight();
    window.addEventListener('resize', updateBounceHeight);
    return (): void => window.removeEventListener('resize', updateBounceHeight);
  }, []);

  return (
    <div className="absolute inset-0 z-[0] pointer-events-none">
      <div
        id="moving-ball"
        ref={ballRef}
        className="absolute ball-size rounded-full bg-black shadow-md animate-zigzag-bounce"
      />
    </div>
  );
}

  
  
  
  

