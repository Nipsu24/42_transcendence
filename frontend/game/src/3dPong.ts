import { Scene, ArcRotateCamera, HemisphericLight, MeshBuilder, Vector3, Color3, StandardMaterial, PBRMaterial, RectAreaLight } from '@babylonjs/core';
import { PongScoreUI } from './ui/PongScoreUI';

let pongScoreUI: PongScoreUI;

let isRunning = false;
let isAi = false;
let aiTargetY: number | null = null;
let aiDecisionTime = 0;
let aiDecisionInterval = 1000;

let leftScore = 0, rightScore = 0;
const maxScore = 10;

let frameCount = 0;
let trailIndex = 0;
const trailColors = [
	Color3.FromHexString("#FEF018"),
	Color3.FromHexString("#FE8915"),
	Color3.FromHexString("#FF4F1A"),
	Color3.FromHexString("#55CFD4"),
	Color3.FromHexString("#26B2C5"),
	Color3.FromHexString("#0489C2"),
];

const lights: RectAreaLight[] = [];
let lightsAnimObserver: any = null;
let updateObserver: any = null; // tracks per-frame update observer to avoid stacking
let paddle1 = { mesh: null as any, x: 0, y: 0, dy: 0 };
let paddle2 = { mesh: null as any, x: 0, y: 0, dy: 0 };
let ball = { mesh: null as any, x: 0, y: 0, dx: 0, dy: 0 };
const speedMod = 1.02;
let baseSpeed = 0; // Store the initial base speed to prevent drift

let playArea = { y: 0, width: 0, height: 0 };

let winnerCallback: ((winner: string, leftScore: number, rightScore: number) => void) | null = null;
let player1Name: string, player2Name: string;

let canvasEl: HTMLCanvasElement;
let scene: Scene;
let handleResize: (() => void) | null = null;

function getPaddleWidth() { return Math.max(playArea.width * 0.0125, 10); }
function getPaddleHeight() { return Math.max(playArea.height * 0.1333, 60); }
function getBallSize() { return Math.max(playArea.width * 0.015, 12); }

function getBallSpeed() { return playArea.width * 0.0075; }
function getPaddleSpeed() { return playArea.height * 0.01; }

function setupInput() {
  document.addEventListener('keydown', keyDownHandler);
  document.addEventListener('keyup', keyUpHandler);
}

function removeInput() {
  document.removeEventListener('keydown', keyDownHandler);
  document.removeEventListener('keyup', keyUpHandler);
}

function keyDownHandler(e: KeyboardEvent) {
  if (e.key === 'w') paddle1.dy = getPaddleSpeed();
  if (e.key === 's') paddle1.dy = -getPaddleSpeed();
  if (e.key === 'ArrowUp' && !isAi) paddle2.dy = getPaddleSpeed();
  if (e.key === 'ArrowDown' && !isAi) paddle2.dy = -getPaddleSpeed();
}

function keyUpHandler(e: KeyboardEvent) {
  if (e.key === 'w' || e.key === 's') paddle1.dy = 0;
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') paddle2.dy = 0;
  if (e.key === 'Escape') endMatch("");
}

function resetBall() {
  ball.x = playArea.width / 2;
  ball.y = playArea.y + (playArea.height / 2);
  aiDecisionInterval = 1000;

  const initialSpeed = baseSpeed || getBallSpeed();
  ball.dx = Math.random() < 0.5 ? -initialSpeed : initialSpeed;

  let angle = 0;
  do {
	angle = Math.random() * initialSpeed - initialSpeed / 2;
  } while (Math.abs(angle) < initialSpeed / 6);
  ball.dy = angle;
}

function predictBallY(): number {
  let simX = ball.x;
  let simY = ball.y;
  let simDx = ball.dx;
  let simDy = ball.dy;
  while (simDx > 0 && simX < playArea.width - getPaddleWidth()*2) 
  {
	simX += simDx;
	simY += simDy;

	if (simY < playArea.y || simY > playArea.y + playArea.height - getBallSize()) 
		simDy *= -1;
  }
  return simY + getBallSize() / 2;
}

function aiBehavior() {
  const now = performance.now();
  if (now - aiDecisionTime < aiDecisionInterval) return;
  aiDecisionTime = now;

  aiTargetY = predictBallY();
  if (ball.dx < 0) 
	aiTargetY = playArea.y + (playArea.height / 2);
}

function controlAI() {
  if (aiTargetY === null) return;

  const paddleMiddle = paddle2.y + getPaddleHeight() / 2;

  if (Math.abs(aiTargetY - paddleMiddle) < getPaddleSpeed()) 
	paddle2.dy = 0;
  else paddle2.dy = (aiTargetY < paddleMiddle) ? -getPaddleSpeed() : getPaddleSpeed();
}

async function update() {
	frameCount++;
	
	paddle1.y += paddle1.dy;
	paddle2.y += paddle2.dy;

	if (isAi) {
		aiBehavior();
		controlAI();
	}

	paddle1.y = Math.max(playArea.y, Math.min(playArea.y + playArea.height - getPaddleHeight(), paddle1.y));
	paddle2.y = Math.max(playArea.y, Math.min(playArea.y + playArea.height - getPaddleHeight(), paddle2.y));

	ball.x += ball.dx;
	ball.y += ball.dy;

	if (ball.y < playArea.y || ball.y > playArea.y + playArea.height - getBallSize()) 
		ball.dy *= -1;
	
	if (
		ball.x < paddle1.x + getPaddleWidth() / 2 &&
		ball.x + getBallSize() > paddle1.x - getPaddleWidth() / 2 &&
		ball.y < paddle1.y + getPaddleHeight() &&
		ball.y + getBallSize() > paddle1.y &&
		ball.dx < 0
	) {
		ball.dx *= -speedMod;
		aiDecisionInterval -= 2;
		ball.x = paddle1.x + getPaddleWidth() / 2 + 1;
	}

	if (
		ball.x < paddle2.x + getPaddleWidth() / 2 &&
		ball.x + getBallSize() > paddle2.x - getPaddleWidth() / 2 &&
		ball.y < paddle2.y + getPaddleHeight() &&
		ball.y + getBallSize() > paddle2.y &&
		ball.dx > 0
	) {
		ball.dx *= -speedMod;
		aiDecisionInterval -= 2;
		ball.x = paddle2.x - getPaddleWidth() / 2 - getBallSize() - 1;
	}

	if (ball.x < 0) {
		rightScore = Math.min(maxScore, rightScore + 1);
		if (rightScore >= maxScore) {
		endMatch(player2Name);
		}
		else resetBall();
	}

	if (ball.x > playArea.width) {
		leftScore = Math.min(maxScore, leftScore + 1);
		if (leftScore >= maxScore) {
		endMatch(player1Name);
		}
		else resetBall();
	}

	paddle1.mesh.position.y = paddle1.y + getPaddleHeight() / 2;
	paddle2.mesh.position.y = paddle2.y + getPaddleHeight() / 2;

	ball.mesh.position.x = ball.x;
	ball.mesh.position.y = ball.y;
	ball.mesh.position.z = 10;

	if (frameCount % 4 === 0) {
		createTrailParticle();
	}

	drawScores();
}

function createTrailParticle() {
	const trailSize = getBallSize();
	const trail = MeshBuilder.CreateSphere("trail" + trailIndex, { diameter: trailSize }, scene);
	
	const trailPos = new Vector3(ball.x, ball.y, 10);
	trail.position = trailPos;

	const trailMat = new StandardMaterial("trailMat" + trailIndex, scene);
	trailMat.emissiveColor = trailColors[trailIndex % trailColors.length];
	trailMat.alpha = 0.8;
	trailMat.disableLighting = true;
	trail.material = trailMat;

	trailIndex++;

	let life = 1.0;
	const fadeSpeed = 0.04;
	
	const fadeAnimation = () => {
		if (!trail.isDisposed()) {
			life -= fadeSpeed;
			trailMat.alpha = life * 0.8;
			
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

function endMatch(winner: string) {
  isRunning = false;
  removeInput();
  paddle1.dy = 0;
  paddle2.dy = 0;
  if (scene.activeCamera) { scene.activeCamera.detachControl(); }
  if (winnerCallback) { winnerCallback(winner, leftScore, rightScore); winnerCallback = null; }
  if (updateObserver) { scene.onBeforeRenderObservable.remove(updateObserver); updateObserver = null; }

  for (let i = 0; i < lights.length; i++) {
    const parent = lights[i].parent;
    lights[i].dispose();
    if (parent && (parent as any).dispose) (parent as any).dispose();
  }
  lights.length = 0;
  if (lightsAnimObserver) { scene.onBeforeRenderObservable.remove(lightsAnimObserver); lightsAnimObserver = null; }

  paddle1.mesh.dispose();
  paddle2.mesh.dispose();
  ball.mesh.dispose();
  if (pongScoreUI) { pongScoreUI.dispose(); pongScoreUI = null as any; }
}

function createLight(
  position: Vector3,
  color: Color3,
  name: string,
  scene: Scene
): RectAreaLight {
	const lightWidth = playArea.width * 0.08;
	const lightHeight = lightWidth * 5;
	
	const box = MeshBuilder.CreateBox(
		"box" + name,
		{ width: lightWidth, height: lightHeight, depth: 2 },
		scene
	);

	const lightMaterial = new StandardMaterial("mat" + name, scene);
	lightMaterial.disableLighting = true;
	lightMaterial.emissiveColor = color;

	box.material = lightMaterial;
	box.position = position;
	
	box.rotation.x = 0;
	box.rotation.y = 0;
	box.rotation.z = 0;

	const light = new RectAreaLight(
		"light" + name,
		new Vector3(0, 0, 1),
		lightWidth,
		lightHeight,
		scene
	);

	light.parent = box;
	light.specular = color;
	light.diffuse = color;
	light.intensity = 1.2;

	return light;
}

function setupPongScene(scene: Scene) {
  scene.meshes.forEach(m => m.dispose());
  scene.lights.forEach(l => l.dispose());
  scene.cameras.forEach(c => c.dispose());

	const camera = new ArcRotateCamera(
		"camera",
		-Math.PI / 2,
		Math.PI / 2 + 0.05,
		Math.max(playArea.width, playArea.height) * 0.8,
		new Vector3(playArea.width/2, playArea.y + playArea.height/2 - 10, 0),
		scene
	);

	camera.setTarget(new Vector3(playArea.width/2, playArea.y + playArea.height/2 - 10, 0));
	camera.detachControl();
	scene.activeCamera = camera;
	
	if (canvasEl) {
		canvasEl.onpointerdown = null;
		canvasEl.onpointermove = null;
		canvasEl.onpointerup = null;
		canvasEl.onwheel = null;
	}

	const colors = [
		Color3.FromHexString("#FEF018"),
		Color3.FromHexString("#FE8915"),
		Color3.FromHexString("#FF4F1A"),
		Color3.FromHexString("#55CFD4"),
		Color3.FromHexString("#26B2C5"),
		Color3.FromHexString("#0489C2"),
	];

	const numOfLights = 6;
	const lightWidth = playArea.width * 0.08;
	const lightGap = lightWidth * 0.5;
	const totalLightSpace = (numOfLights * lightWidth) + ((numOfLights - 1) * lightGap);
	const startX = (playArea.width - totalLightSpace) / 2;
	
	const zBack = 60;
	const yPos = playArea.height * 0.5;

	for (let i = 0; i < numOfLights; i++) {
		const color = colors[i % colors.length];
		const x = startX + (i * (lightWidth + lightGap)) + (lightWidth / 2);
		lights.push(createLight(new Vector3(x, yPos, zBack), color, "light" + i, scene));
	}

	if (lightsAnimObserver) { scene.onBeforeRenderObservable.remove(lightsAnimObserver); lightsAnimObserver = null; }
	lightsAnimObserver = scene.onBeforeRenderObservable.add(() => {
		const time = performance.now() * 0.002; // scale speed
		for (let i = 0; i < lights.length; i++) {
			lights[i].intensity = 0.5 + 0.5 * Math.sin(time + i);
		}
	});

	const mat1 = new StandardMaterial("mat1", scene);
	mat1.roughness = 0.3;

	const groundMat = new PBRMaterial("groundMat", scene);
	groundMat.albedoColor = new Color3(1, 1, 1);
	groundMat.roughness = 0.15;
	groundMat.maxSimultaneousLights = 8;

	const ground = MeshBuilder.CreateGround
	(
		"ground", 
		{ width: playArea.width * 2, height: playArea.height * 2 }, 
		scene
	);
	ground.material = groundMat;
	ground.position.y = playArea.y - getBallSize() * 0.5;
	ground.position.x = playArea.width / 2;
	ground.position.z = 0;

	const ceiling = MeshBuilder.CreateGround
	(
		"ceiling", 
		{ width: playArea.width * 2, height: playArea.height * 2 }, 
		scene
	);
	ceiling.material = groundMat;
	ceiling.position.y = playArea.y + playArea.height + 1;
	ceiling.position.x = playArea.width / 2;
	ceiling.position.z = 0;
	ceiling.rotation.x = Math.PI;

	const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
	light.intensity = 0.8;

	const blackMat = new StandardMaterial("black", scene);
	blackMat.diffuseColor = new Color3(0.95, 0.89, 0.89);


	const paddle1Mat = new StandardMaterial("paddle1Mat", scene);
	paddle1Mat.diffuseColor = Color3.FromHexString("#FEF018");
	paddle1Mat.emissiveColor = paddle1Mat.diffuseColor.scale(0.3);

	const paddle2Mat = new StandardMaterial("paddle2Mat", scene);
	paddle2Mat.diffuseColor = Color3.FromHexString("#0489C2");
	paddle2Mat.emissiveColor = paddle2Mat.diffuseColor.scale(0.3);
	
	scene.ambientColor = new Color3(1, 1, 1);
	
	var light1 = new HemisphericLight("hemiLight", new Vector3(1, -1, 0), scene);
	light1.diffuse = new Color3(1, 0, 0);
	light1.specular = new Color3(0, 1, 0);
	light1.groundColor = new Color3(0, 1, 0);
	
	var ballMat = new StandardMaterial("redMat", scene);
	ballMat.ambientColor = new Color3(1, 1, 1);

	const ballSize = Math.max(playArea.width * 0.015, 20);
	ball.mesh = MeshBuilder.CreateSphere("ball", { diameter: ballSize }, scene);
	ball.mesh.material = ballMat;
	
	const paddleWidth = Math.max(getPaddleWidth(), 15);
	const paddleHeight = Math.max(getPaddleHeight(), 80);
	
	paddle1.mesh = MeshBuilder.CreateBox("paddle1", { 
		width: paddleWidth, 
		height: paddleHeight, 
		depth: 8 
	}, scene);
  	paddle1.mesh.material = paddle1Mat;
	paddle1.mesh.position.x = paddleWidth / 2;
	paddle1.mesh.position.y = playArea.y + (playArea.height / 2);
	
	paddle2.mesh = MeshBuilder.CreateBox("paddle2", { 
		width: paddleWidth, 
		height: paddleHeight, 
		depth: 8 
	}, scene);
  	paddle2.mesh.material = paddle2Mat;
	paddle2.mesh.position.x = playArea.width - (paddleWidth / 2);
	paddle2.mesh.position.y = playArea.y + (playArea.height / 2);

	mat1.maxSimultaneousLights = 8;
	blackMat.maxSimultaneousLights = 8;
	paddle1Mat.maxSimultaneousLights = 8;
	paddle2Mat.maxSimultaneousLights = 8;
}

function drawScores() {
  if (!pongScoreUI) return;
  pongScoreUI.updateScores(leftScore, rightScore);
}

export async function startPongMatch(
  canvas: HTMLCanvasElement,
  sceneEl: Scene,
  ai: boolean,
  p1: string,
  p2: string,
  onMatchEnd: (winner: string, leftScore: number, rightScore: number) => void
) {
  canvasEl = canvas;
  scene = sceneEl;

	const rect = canvasEl.getBoundingClientRect();
	
	const viewportWidth = window.innerWidth;
	const viewportHeight = window.innerHeight;
	const canvasWidth = Math.min(rect.width, viewportWidth);
	const canvasHeight = Math.min(rect.height, viewportHeight);
	
	const topMargin = canvasHeight * 0.08;
	const bottomMargin = canvasHeight * 0.08;

	playArea = {
		y: topMargin,
		width: canvasWidth,
		height: canvasHeight - topMargin - bottomMargin
	};

	player1Name = p1;
	player2Name = ai ? "AI player" : p2;
	winnerCallback = onMatchEnd;
	isAi = ai;

	leftScore = 0; 
	rightScore = 0;

	baseSpeed = playArea.width * 0.0075;
	ball.dx = 0;
	ball.dy = 0;

	setupPongScene(scene);
	
	pongScoreUI = new PongScoreUI(canvasEl, scene, player1Name, player2Name);

	paddle1.x = getPaddleWidth() / 2;
	paddle1.y = playArea.y + (playArea.height / 2) - (getPaddleHeight() / 2);
	paddle2.x = playArea.width - getPaddleWidth() / 2;
	paddle2.y = playArea.y + (playArea.height / 2) - (getPaddleHeight() / 2);
	
	paddle1.mesh.position.x = paddle1.x;
	paddle1.mesh.position.y = paddle1.y + getPaddleHeight() / 2;
	paddle1.mesh.position.z = 0;
	paddle2.mesh.position.x = paddle2.x;
	paddle2.mesh.position.y = paddle2.y + getPaddleHeight() / 2;
	paddle2.mesh.position.z = 0;

	ball.x = playArea.width / 2; 
	ball.y = playArea.y + (playArea.height / 2);
	ball.mesh.position.x = ball.x;
	ball.mesh.position.y = ball.y;  
	ball.mesh.position.z = 0;

	leftScore = 0; 
	rightScore = 0;
	resetBall();

	isRunning = true;
	setupInput();

	handleResize = () => {
  };
	
	if (updateObserver) { scene.onBeforeRenderObservable.remove(updateObserver); updateObserver = null; }
	updateObserver = scene.onBeforeRenderObservable.add(() => {
		if (!isRunning) return;
		update();
	});
}

export function stopPong() {
  isRunning = false;
  removeInput();
  if (pongScoreUI) { pongScoreUI.dispose(); pongScoreUI = null as any; }
}