import React, { useEffect, useRef } from 'react';
import { startMenu } from '../../game/src/menu';

export default function GamePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Defer until canvas is definitely mounted
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Could not get 2D context');
      return;
    }

    canvas.width = 800;
    canvas.height = 600;

    startMenu(canvas, ctx);

    return () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, []); // runs after initial render

  return (
    <div className="w-full h-screen flex items-center justify-center" >
      <canvas ref={canvasRef} /* className={{ border: '1px solid black', justifyContent: 'center' }} */  />
    </div>
  );
}