import { useEffect, useRef } from "react";
import {
  ArcRotateCamera,
  Color3,
  Color4,
  Engine,
  HemisphericLight,
  Mesh,
  MeshBuilder,
  PBRMaterial,
  Scene,
  Vector3,
  StandardMaterial,
  RectAreaLight
} from "@babylonjs/core";


function createLight(
  position: Vector3,
  color: Color3,
  name: string,
  scene: Scene
): RectAreaLight {
const box = MeshBuilder.CreateBox(
            "box" + name,
            { width: 2, height: 15, depth: 0.01 },
            scene
        );

        const lightMaterial = new StandardMaterial("mat" + name, scene);
        lightMaterial.disableLighting = true;
        lightMaterial.emissiveColor = color;

        box.material = lightMaterial;
        box.position = position;

        const light = new RectAreaLight(
            "light" + name,
            new Vector3(0, 0, -1),
            2,
            15,
            scene
        );

        light.parent = box;
        light.specular = color;
        light.diffuse = color;
        light.intensity = 0.8;

        return light;
}

export async function createScene(engine: Engine, canvas: HTMLCanvasElement): Promise<Scene> {
  const scene = new Scene(engine);
      scene.clearColor = new Color4(0, 0, 0);
  
      const camera = new ArcRotateCamera(
        "camera",
        4.1398,
        0.933,
        40,
        new Vector3(0, 3, 0),
        scene
      );
      camera.attachControl(canvas, true);
  
    const colors = [
      Color3.FromHexString("#FEF018"),
      Color3.FromHexString("#FE8915"),
      Color3.FromHexString("#FF4F1A"),
      Color3.FromHexString("#55CFD4"),
      Color3.FromHexString("#26B2C5"),
      Color3.FromHexString("#0489C2"),
    ];
  
    const zBack = 15;
    const yPos = 3;
    const spacing = 3;
    const numOfLights = 6;
  
    const lights: RectAreaLight[] = [];
  
    for (let i = 0; i < numOfLights; i++) {
      const color = colors[i % colors.length];
      const x = (i - (numOfLights - 1) / 2) * spacing;
      lights.push(createLight(new Vector3(x, yPos - 5, zBack), color, "light" + i, scene));
    }
  
    scene.onBeforeRenderObservable.add(() => {
      const time = performance.now() * 0.002; // scale speed
      lights.forEach((light, i) => {
        light.intensity = 0.5 + 0.5 * Math.sin(time + i); // phase shift per light
      });
    });
  
    const mat1 = new StandardMaterial("mat1", scene);
    mat1.roughness = 0.3;
  
    const groundMat = new PBRMaterial("groundMat", scene);
    groundMat.albedoColor = new Color3(1, 1, 1);
    groundMat.roughness = 0.15;
    groundMat.maxSimultaneousLights = 6;
    const ground = MeshBuilder.CreateGround("ground", { width: 120, height: 120 }, scene);
    ground.material = groundMat;
    ground.position.y = - 8;
  
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 0.8;
  
    const blackMat = new StandardMaterial("black", scene);
    blackMat.diffuseColor = new Color3(0.95, 0.89, 0.89);
  
  
    const paddle1Mat = new StandardMaterial("paddle1Mat", scene);
    paddle1Mat.diffuseColor = Color3.FromHexString("#FEF018"); // yellow
  
    const paddle2Mat = new StandardMaterial("paddle2Mat", scene);
    paddle2Mat.diffuseColor = Color3.FromHexString("#0489C2"); // blue
  
    const paddle1 = MeshBuilder.CreateBox("paddle1", { width: 1, height: 4, depth: 0.5 }, scene);
    paddle1.material = blackMat;
    paddle1.position.x = -10;
    paddle1.position.y = 2;
  
    const paddle2 = MeshBuilder.CreateBox("paddle2", { width: 1, height: 4, depth: 0.5 }, scene);
    paddle2.material = blackMat;
    paddle2.position.x = 10;
    paddle2.position.y = 2;
  
    var redMat = new StandardMaterial("redMat", scene);
    redMat.ambientColor = new Color3(1, 0, 0);
  
    var greenMat = new StandardMaterial("redMat", scene);
    greenMat.ambientColor = new Color3(1, 1, 1);
  
    paddle1.material = redMat;
    paddle2.material = greenMat;
  
    scene.ambientColor = new Color3(1, 1, 1);
  
    var light1 = new HemisphericLight("hemiLight", new Vector3(1, -1, 0), scene);
    light1.diffuse = new Color3(1, 0, 0);
    light1.specular = new Color3(0, 1, 0);
    light1.groundColor = new Color3(0, 1, 0);
  
    const ball = MeshBuilder.CreateSphere("ball", { diameter: 1 }, scene);
    ball.material = greenMat;
  
    const trailColors = [
      Color3.FromHexString("#FEF018"),
      Color3.FromHexString("#FE8915"),
      Color3.FromHexString("#FF4F1A"),
      Color3.FromHexString("#55CFD4"),
      Color3.FromHexString("#26B2C5"),
      Color3.FromHexString("#0489C2"),
    ];
    let trailIndex = 0;
    let frameCount = 0;
  
    let ballVelocity = new Vector3(0.2, 0.1, 0);
  
    mat1.maxSimultaneousLights = 8;
    blackMat.maxSimultaneousLights = 8;
    redMat.maxSimultaneousLights = 8;
    greenMat.maxSimultaneousLights = 8;
    paddle1Mat.maxSimultaneousLights = 8;
    paddle2Mat.maxSimultaneousLights = 8;
  
    let paddle1TargetY = 0;
    let paddle2TargetY = 0;
  
    setInterval(() => {
      paddle1TargetY = ball.position.y + (Math.random() - 0.5); // small random offset
    }, 100);
  
    setInterval(() => {
      paddle2TargetY = ball.position.y + (Math.random() - 0.5) * 2; // larger random offset
    }, 200);
  
    scene.onBeforeRenderObservable.add(() => {
      frameCount++;
      ball.position.addInPlace(ballVelocity);
  
      if (ball.position.y > 6 || ball.position.y < -6) {
        ballVelocity.y *= -1;
      }
  
      if (frameCount % 6 === 0) {
        const trail = MeshBuilder.CreateSphere("trail", { diameter: 1 }, scene);
        const trailPos = ball.position.clone();
        trailPos.z += 0.5;
        trail.position = trailPos;
  
        const trailMat = new StandardMaterial("trailMat" + trailIndex, scene);
        trailMat.emissiveColor = trailColors[trailIndex % trailColors.length];
        trailMat.alpha = 1;
        trailMat.disableLighting = true;
        trail.material = trailMat;
  
        trailIndex++;
  
        let life = 1;
        scene.onBeforeRenderObservable.add(() => {
          life -= 0.05;
          trailMat.alpha = life;
          if (life <= 0) {
            trail.dispose();
          }
        });
      }
  
      const hitPaddle1 = ball.intersectsMesh(paddle1, false);
      const hitPaddle2 = ball.intersectsMesh(paddle2, false);
  
      if ((hitPaddle1 && ballVelocity.x < 0) || (hitPaddle2 && ballVelocity.x > 0)) {
			ballVelocity.x *= -1;
		}

		if (ball.position.x < -12 || ball.position.x > 12) {
			ball.position.set(0, 0, 0);
			ballVelocity = new Vector3(0.2 * (Math.random() > 0.5 ? 1 : -1), 0.1, 0);
		}
  
      const paddle1Noise = (Math.random() - 0.5) * 0.5;
      const paddle2Noise = (Math.random() - 0.5) * 1.2;
  
      const paddle1TargetY = ball.position.y + paddle1Noise;
      const paddle2TargetY = ball.position.y + paddle2Noise;
  
      function lerp(current: number, target: number, alpha: number): number {
        return current + (target - current) * alpha;
      }
  
      paddle1.position.y = lerp(paddle1.position.y, paddle1TargetY, 0.1); // more responsive
      paddle2.position.y = lerp(paddle2.position.y, paddle2TargetY, 0.05);
    });

  const balls: { mesh: Mesh; velocity: Vector3 }[] = [];

  function addBall() {
    if (balls.length >= 200) return;

    const color = colors[Math.floor(Math.random() * colors.length)];
    const mat = new StandardMaterial("ballMat" + balls.length, scene);
    mat.ambientColor = color;

    const ball = MeshBuilder.CreateSphere("ball" + balls.length, { diameter: 1 }, scene);
    ball.material = mat;
    ball.position = new Vector3(
      (Math.random() - 0.5) * 10,
      Math.random() * 5,
      (Math.random() - 0.5) * 5
    );

    const velocity = new Vector3(
      (Math.random() - 0.5) * 0.4,
      (Math.random() - 0.5) * 0.4,
      (Math.random() - 0.5) * 0.4
    );

    balls.push({ mesh: ball, velocity });
  }

  canvas.addEventListener("click", addBall);

  scene.onBeforeRenderObservable.add(() => {
    const dt = engine.getDeltaTime() / 16;
    const bounds = { x: 12, y: 6, z: 10 };

    for (let i = 0; i < balls.length; i++) {
      const b = balls[i];
      const pos = b.mesh.position;
      const v = b.velocity;

      pos.addInPlace(v.scale(dt));

      if (pos.x > bounds.x || pos.x < -bounds.x) v.x *= -1;
      if (pos.y > bounds.y || pos.y < -6) v.y *= -1;
      if (pos.z > bounds.z || pos.z < -bounds.z) v.z *= -1;

      pos.x = Math.max(-bounds.x, Math.min(bounds.x, pos.x));
      pos.y = Math.max(-6, Math.min(bounds.y, pos.y));
      pos.z = Math.max(-bounds.z, Math.min(bounds.z, pos.z));
    }

    for (let i = 0; i < balls.length; i++) {
      for (let j = i + 1; j < balls.length; j++) {
        const a = balls[i];
        const b = balls[j];
        const diff = a.mesh.position.subtract(b.mesh.position);
        const dist = diff.length();
        if (dist < 1 && dist > 0) {
          const normal = diff.normalize();
          const overlap = 1 - dist;
          a.mesh.position.addInPlace(normal.scale(overlap / 2));
          b.mesh.position.addInPlace(normal.scale(-overlap / 2));

          const v1 = a.velocity;
          const v2 = b.velocity;
          const relVel = v1.subtract(v2);
          const sepVel = Vector3.Dot(relVel, normal);
          if (sepVel < 0) {
            const impulse = normal.scale(-sepVel);
            v1.addInPlace(impulse.scale(0.5));
            v2.addInPlace(impulse.scale(-0.5));
          }
        }
      }
    }
  });

  await scene.whenReadyAsync();
  return scene;
}

export default function HaveFunPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new Engine(canvas, true);

    createScene(engine, canvas).then((scene) => {
      engine.runRenderLoop(() => scene.render());
    });

    const handleResize = () => engine.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      engine.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-[#000000]">
      <h2 className="text-2xl font-body tracking-wider mb-4 text-white">
        Have Fun! (click to add balls)
      </h2>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
