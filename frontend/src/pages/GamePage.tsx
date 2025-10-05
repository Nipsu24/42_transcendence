import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { attachTouchAdapter } from '../components/attachTouchAdapter';
import { startMenu } from '../../game/src/menu';
import { SceneManager } from '../../game/src/core/SceneManager';
import { Color4, Vector3 } from '@babylonjs/core';

export default function GamePage() {

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    const sceneManager = new SceneManager(canvas, {
      clearColor: new Color4(0, 0, 0, 0),
      cameraTarget: Vector3.Zero(),
      lightDirection: new Vector3(0, 1, 0),
      lightIntensity: 0.7
    });

    const scene = sceneManager.getScene();

    let cleanup: (() => void) | undefined;

    (async () => {
      cleanup = await startMenu(canvas, scene, () => {
      if (cleanup) cleanup();
        navigate("/myhome");
      });
    })();

    return () => {
      sceneManager.dispose();
      if (cleanup) cleanup();
    };
  }, [navigate]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    return attachTouchAdapter(canvas);
  }, []);

   useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    return attachTouchAdapter(canvas);
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh", background: "#111" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
