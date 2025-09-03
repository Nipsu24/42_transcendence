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

    const ASPECT_RATIO = 4 / 3;
    const MIN_WIDTH = 320;
    const MIN_HEIGHT = 240;

    let width = window.innerWidth * 0.75;
    let height = window.innerHeight * 0.75;

    if (width / height > ASPECT_RATIO) {
      width = height * ASPECT_RATIO;
    }
    else {
      height = width / ASPECT_RATIO;
    }

    width = Math.max(width, MIN_WIDTH);
    height = Math.max(height, MIN_HEIGHT);

    canvas.width = Math.floor(width);
    canvas.height = Math.floor(height);

    startMenu(canvas, ctx, () => {
      navigate('/myhome');
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
