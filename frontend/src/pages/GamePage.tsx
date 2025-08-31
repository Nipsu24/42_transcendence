import React, { useEffect, useRef } from 'react';
import { startMenu } from '../../game/src/menu';
import { useNavigate } from 'react-router-dom';

export default function GamePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 640;

    startMenu(canvas, ctx, () => {
      navigate('/');
    });

    return () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [navigate]);

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <canvas ref={canvasRef} />
    </div>
  );
}
