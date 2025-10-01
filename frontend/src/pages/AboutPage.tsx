import React, { useEffect, useRef } from "react";
import {
  ArcRotateCamera,
  Color3,
  Color4,
  Engine,
  HemisphericLight,
  MeshBuilder,
  PBRMaterial,
  Scene,
  Vector3,
  RectAreaLight,
  StandardMaterial,
  Sound
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

        //const lightMaterial = new PBRMaterial("mat" + name, scene);
        //lightMaterial.albedoColor = color;            // base color
        //lightMaterial.emissiveColor = color;          // glow color
        //lightMaterial.roughness = 1;                  // no reflections
        //lightMaterial.metallic = 0;                   // non-metallic

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

// Function to create the scene
export async function createScene(
  engine: Engine,
  canvas: HTMLCanvasElement
): Promise<Scene> {
	const scene = new Scene(engine);
  	scene.clearColor = new Color4(0, 0, 0);

  	// Camera
  	const camera = new ArcRotateCamera(
    	"camera",
    	4.1398,
    	0.933,
    	40,
    	new Vector3(0, 3, 0),
    	scene
  	);
  	camera.attachControl(canvas, true);

	// Colours
	const colors = [
		Color3.FromHexString("#FEF018"),
		Color3.FromHexString("#FE8915"),
		Color3.FromHexString("#FF4F1A"),
		Color3.FromHexString("#55CFD4"),
		Color3.FromHexString("#26B2C5"),
		Color3.FromHexString("#0489C2"),
	];

	// Sound effects
	var music = new Sound("pongMusic", 
		"frontend/src/assets/pongsounds.mp3", 
		scene, null, {loop: true, autoplay: false});
	music.play(undefined, 19);
	
	var hitSoundEffect = new Sound("pongMusic", 
		"frontend/src/assets/bubble-pop.mp3", 
		scene, null, {loop: false, autoplay: false});

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

	// Pulse animation
	scene.onBeforeRenderObservable.add(() => {
		const time = performance.now() * 0.002; // scale speed
		lights.forEach((light, i) => {
			// Use sine wave for smooth pulsing
			light.intensity = 0.5 + 0.5 * Math.sin(time + i); // phase shift per light
		});
	});

	const mat1 = new StandardMaterial("mat1", scene);
	mat1.roughness = 0.3;

	const groundMat = new PBRMaterial("groundMat", scene);
	groundMat.albedoColor = new Color3(1, 1, 1);
	groundMat.roughness = 0.15;
	groundMat.maxSimultaneousLights = 6;
	// Ground
	const ground = MeshBuilder.CreateGround("ground", { width: 120, height: 120 }, scene);
	//ground.material = mat1;
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

	//Light direction is up and left
	var light1 = new HemisphericLight("hemiLight", new Vector3(1, -1, 0), scene);
	light1.diffuse = new Color3(1, 0, 0);
	light1.specular = new Color3(0, 1, 0);
	light1.groundColor = new Color3(0, 1, 0);
	/* //No ambient color
		var sphere0 = MeshBuilder.CreateSphere("sphere0", {}, scene);
		sphere0.position.x = -1.5;  
			
		//Red Ambient  
		var sphere1 = MeshBuilder.CreateSphere("sphere1", {}, scene);
		sphere1.material = redMat;
			
			//Green Ambient
			var sphere2 = MeshBuilder.CreateSphere("sphere2", {}, scene);
			sphere2.material = greenMat;
			sphere2.position.x = 1.5;    */


	// Ball and paddles
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
	// if you use these:
	paddle1Mat.maxSimultaneousLights = 8;
	paddle2Mat.maxSimultaneousLights = 8;

	let paddle1TargetY = 0;
	let paddle2TargetY = 0;
	const paddleSpeed = 0.1;

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
			// Create trail
			const trail = MeshBuilder.CreateSphere("trail", { diameter: 1 }, scene);
			const trailPos = ball.position.clone();
			trailPos.z += 0.5;
			trail.position = trailPos;

			// Emissive color
			const trailMat = new StandardMaterial("trailMat" + trailIndex, scene);
			trailMat.emissiveColor = trailColors[trailIndex % trailColors.length];
			trailMat.alpha = 1;
			trailMat.disableLighting = true;
			trail.material = trailMat;

			trailIndex++;

			// Fade out
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

			const impactPosition = ball.position.clone();
			hitSoundEffect.play();

			const impactEmitter = MeshBuilder.CreateBox("impactEmitter", { size: 0.1 }, scene);
			impactEmitter.isVisible = true;
			impactEmitter.position = impactPosition;
		}

		if (ball.position.x < -12 || ball.position.x > 12) {
			ball.position.set(0, 0, 0);
			ballVelocity = new Vector3(0.2 * (Math.random() > 0.5 ? 1 : -1), 0.1, 0);
		}

		const paddle1Noise = (Math.random() - 0.5) * 0.5;
		const paddle2Noise = (Math.random() - 0.5) * 1.2;

		const paddle1TargetY = ball.position.y + paddle1Noise;
		const paddle2TargetY = ball.position.y + paddle2Noise;

		//const paddle1TargetY = 2 + ball.position.y + (Math.random() - 0.5);
		//const paddle2TargetY = 2 + ball.position.y + (Math.random() - 0.5) * 2;

		function lerp(current: number, target: number, alpha: number): number {
			return current + (target - current) * alpha;
		}

		paddle1.position.y = lerp(paddle1.position.y, paddle1TargetY, 0.1); // more responsive
		paddle2.position.y = lerp(paddle2.position.y, paddle2TargetY, 0.05);
	});


  await scene.whenReadyAsync();
  return scene;
}

// AboutPage Component
export default function AboutPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new Engine(canvas, true);

    createScene(engine, canvas).then((scene) => {
      engine.runRenderLoop(() => {
        scene.render();
      });
    });

    const handleResize = () => {
      engine.resize();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      engine.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-[#fffffe]">
      <h2 className="text-2xl font-body tracking-wider mb-4">About Transcendence</h2>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}