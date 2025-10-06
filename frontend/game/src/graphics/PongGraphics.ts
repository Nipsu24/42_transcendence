import { Scene, MeshBuilder, Vector3, Color3, StandardMaterial, PBRMaterial, RectAreaLight, ArcRotateCamera, HemisphericLight } from '@babylonjs/core';

export interface PongGameObjects {
  paddle1: any;
  paddle2: any;
  ball: any;
  ground: any;
  ceiling: any;
  lights: RectAreaLight[];
}

export class PongGraphics {
  private scene: Scene;
  private trailColors: Color3[];

  constructor(scene: Scene) {
	this.scene = scene;
	this.trailColors = [
	  Color3.FromHexString("#FEF018"),
	  Color3.FromHexString("#FE8915"),
	  Color3.FromHexString("#FF4F1A"),
	  Color3.FromHexString("#55CFD4"),
	  Color3.FromHexString("#26B2C5"),
	  Color3.FromHexString("#0489C2"),
	];
  }

  public createPaddle(name: string, width: number, height: number, depth: number = 8): any {
	const paddle = MeshBuilder.CreateBox(name, {
	  width: width,
	  height: height,
	  depth: depth
	}, this.scene);

	const paddleMat = new StandardMaterial(`${name}Mat`, this.scene);
	if (name === "paddle1") {
	  paddleMat.diffuseColor = Color3.FromHexString("#FEF018");
	  paddleMat.emissiveColor = paddleMat.diffuseColor.scale(0.3);
	} else {
	  paddleMat.diffuseColor = Color3.FromHexString("#0489C2");
	  paddleMat.emissiveColor = paddleMat.diffuseColor.scale(0.3);
	}
	paddleMat.maxSimultaneousLights = 8;
	paddle.material = paddleMat;
	return paddle;
  }

  public createBall(diameter: number): any {
	const ball = MeshBuilder.CreateSphere("ball", { diameter }, this.scene);
	const ballMat = new StandardMaterial("redMat", this.scene);
	ballMat.ambientColor = new Color3(1, 1, 1);
	ball.material = ballMat;
	return ball;
  }

  public createGround(width: number, height: number, y: number, x: number): any {
	const groundMat = new PBRMaterial("groundMat", this.scene);
	groundMat.albedoColor = new Color3(1, 1, 1);
	groundMat.roughness = 0.15;
	groundMat.maxSimultaneousLights = 8;
	const ground = MeshBuilder.CreateGround("ground", { width, height }, this.scene);
	ground.material = groundMat;
	ground.position.y = y;
	ground.position.x = x;
	ground.position.z = 0;
	return ground;
  }

  public createCeiling(width: number, height: number, y: number, x: number): any {
	const groundMat = new PBRMaterial("groundMat", this.scene);
	groundMat.albedoColor = new Color3(1, 1, 1);
	groundMat.roughness = 0.15;
	groundMat.maxSimultaneousLights = 8;
	const ceiling = MeshBuilder.CreateGround("ceiling", { width, height }, this.scene);
	ceiling.material = groundMat;
	ceiling.position.y = y;
	ceiling.position.x = x;
	ceiling.position.z = 0;
	ceiling.rotation.x = Math.PI;
	return ceiling;
  }

  public createLights(playArea: any): RectAreaLight[] {
	const colors = this.trailColors;
	const numOfLights = 6;
	const lightWidth = playArea.width * 0.08;
	const lightGap = lightWidth * 0.5;
	const totalLightSpace = (numOfLights * lightWidth) + ((numOfLights - 1) * lightGap);
	const startX = (playArea.width - totalLightSpace) / 2;
	const zBack = 60;
	const yPos = playArea.height * 0.5;
	const lights: RectAreaLight[] = [];
	for (let i = 0; i < numOfLights; i++) {
	  const color = colors[i % colors.length];
	  const x = startX + (i * (lightWidth + lightGap)) + (lightWidth / 2);
	  // Create parent box for light
	  const box = MeshBuilder.CreateBox(
		"box" + i,
		{ width: lightWidth, height: lightWidth * 5, depth: 2 },
		this.scene
	  );
	  const lightMaterial = new StandardMaterial("mat" + i, this.scene);
	  lightMaterial.disableLighting = true;
	  lightMaterial.emissiveColor = color;
	  box.material = lightMaterial;
	  box.position = new Vector3(x, yPos, zBack);
	  box.rotation.x = 0;
	  box.rotation.y = 0;
	  box.rotation.z = 0;
	  const light = new RectAreaLight(
		"light" + i,
		new Vector3(0, 0, 1),
		lightWidth,
		lightWidth * 5,
		this.scene
	  );
	  light.parent = box;
	  light.specular = color;
	  light.diffuse = color;
	  light.intensity = 1.2;
	  lights.push(light);
	}
	return lights;
  }

  public animateLights(lights: RectAreaLight[], frameCount: number): void {
	const time = performance.now() * 0.002;
	for (let i = 0; i < lights.length; i++) {
	  lights[i].intensity = 0.5 + 0.5 * Math.sin(time + i);
	}
  }

  public setupSceneAndCamera(playArea: any, canvasEl: HTMLCanvasElement): ArcRotateCamera {
	this.scene.meshes.forEach(m => m.dispose());
	this.scene.lights.forEach(l => l.dispose());
	this.scene.cameras.forEach(c => c.dispose());
	const camera = new ArcRotateCamera(
	  "camera",
	  -Math.PI / 2,
	  Math.PI / 2 + 0.05,
	  Math.max(playArea.width, playArea.height) * 0.8,
	  new Vector3(playArea.width/2, playArea.y + playArea.height/2 - 10, 0),
	  this.scene
	);
	camera.setTarget(new Vector3(playArea.width/2, playArea.y + playArea.height/2 - 10, 0));
	camera.detachControl();
	this.scene.activeCamera = camera;
	if (canvasEl) {
	  canvasEl.onpointerdown = null;
	  canvasEl.onpointermove = null;
	  canvasEl.onpointerup = null;
	  canvasEl.onwheel = null;
	}
	const ambientLight = new HemisphericLight("light", new Vector3(0, 1, 0), this.scene);
	ambientLight.intensity = 0.8;
	this.scene.ambientColor = new Color3(1, 1, 1);
	var light1 = new HemisphericLight("hemiLight", new Vector3(1, -1, 0), this.scene);
	light1.diffuse = new Color3(1, 0, 0);
	light1.specular = new Color3(0, 1, 0);
	light1.groundColor = new Color3(0, 1, 0);
	return camera;
  }

  public setupPongGameObjects(playArea: any, getBallSize: () => number, 
  		getPaddleWidth: () => number, 
		getPaddleHeight: () => number): PongGameObjects 
	{
		const paddleWidth = Math.max(getPaddleWidth(), 15);
		const paddleHeight = Math.max(getPaddleHeight(), 80);
		const ballSize = Math.max(playArea.width * 0.015, 20);
		const paddle1 = this.createPaddle("paddle1", paddleWidth, paddleHeight, 8);
		paddle1.position.x = paddleWidth / 2;
		paddle1.position.y = playArea.y + (playArea.height / 2);
		const paddle2 = this.createPaddle("paddle2", paddleWidth, paddleHeight, 8);
		paddle2.position.x = playArea.width - (paddleWidth / 2);
		paddle2.position.y = playArea.y + (playArea.height / 2);
		const ball = this.createBall(ballSize);
		const ground = this.createGround(
			playArea.width * 2, 
			playArea.height * 2, 
			playArea.y - getBallSize() * 0.5, 
			playArea.width / 2
		);
		const ceiling = this.createCeiling(
			playArea.width * 2, 
			playArea.height * 2, 
			playArea.y + playArea.height + 1, 
			playArea.width / 2
		);
		const lights = this.createLights(playArea);
		return {
		paddle1,
		paddle2,
		ball,
		ground,
		ceiling,
		lights
		};
  }

  public createTrailParticle(
	ballX: number, 
	ballY: number, 
	ballSize: number, 
	trailIndex: number
  ): void {
	const trail = MeshBuilder.CreateSphere("trail" + trailIndex, { 
	  diameter: ballSize 
	}, this.scene);
	const trailPos = new Vector3(ballX, ballY, 10);
	trail.position = trailPos;
	const trailMat = new StandardMaterial("trailMat" + trailIndex, this.scene);
	trailMat.emissiveColor = this.trailColors[trailIndex % this.trailColors.length];
	trailMat.alpha = 0.8;
	trailMat.disableLighting = true;
	trail.material = trailMat;
	this.animateTrailFade(trail, trailMat);
  }

  private animateTrailFade(trail: any, material: StandardMaterial): void {
	let life = 1.0;
	const fadeSpeed = 0.04;
	const fadeAnimation = () => {
	  if (!trail.isDisposed()) {
		life -= fadeSpeed;
		material.alpha = life * 0.8;
		const scale = life * 0.9 + 0.1;
		trail.scaling = new Vector3(scale, scale, scale);
		if (life <= 0) {
		  trail.dispose();
		  return;
		}
		requestAnimationFrame(fadeAnimation);
	  }
	};
	requestAnimationFrame(fadeAnimation);
  }

  public getTrailColors(): Color3[] {
	return this.trailColors;
  }

  public dispose(): void {
	// Cleanup any resources if needed
  }
}