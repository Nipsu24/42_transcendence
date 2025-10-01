import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { attachTouchAdapter } from '../components/attachTouchAdapter';
import { startMenu } from '../../game/src/menu';
import { Engine, Scene, ArcRotateCamera, HemisphericLight, Color4, Vector3 } from '@babylonjs/core';

export default function GamePage() {

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    const engine = new Engine(canvas, true);
    const scene = new Scene(engine);

      scene.clearColor = new Color4(0, 0, 0, 0);
      
      const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 10, Vector3.Zero(), scene);
      camera.attachControl(canvas, false);
    
      const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
      light.intensity = 0.7;

      engine.runRenderLoop(() => {
        scene.render();
      });

      const resizeHandler = () => {
        engine.resize();
      };
      window.addEventListener("resize", resizeHandler);

    let cleanup: (() => void) | undefined;

    (async () => {
      cleanup = await startMenu(canvas, scene, () => {
      if (cleanup) cleanup();
        navigate("/myhome");
      });
    })();

    return () => {
      window.removeEventListener("resize", resizeHandler);
      scene.dispose();
      engine.dispose();
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
