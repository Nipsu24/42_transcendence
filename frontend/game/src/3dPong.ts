import { Scene, RectAreaLight
} from '@babylonjs/core';
import { PongGraphics } from './graphics/PongGraphics';
import { PongScoreUI } from './ui/PongScoreUI';

let pongScoreUI: PongScoreUI;
let pongGraphics: PongGraphics;

let isRunning = false;
let isAi = false;
let aiTargetY: number | null = null;
let aiDecisionTime = 0;
let aiDecisionInterval = 1000;

let leftScore = 0, rightScore = 0;
const maxScore = 10;

let frameCount = 0;
let trailIndex = 0;
// Trail colors are now handled by PongGraphics class

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

  // Use stored baseSpeed instead of recalculating to prevent drift
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
	if (!pongGraphics) return;
	
	const trailSize = getBallSize();
	pongGraphics.createTrailParticle(ball.x, ball.y, trailSize, trailIndex);
	trailIndex++;
}

function endMatch(winner: string) {
  isRunning = false;
  removeInput();
  paddle1.dy = 0; // ensure no residual motion
  paddle2.dy = 0;
  window.removeEventListener('resize', handleResize);
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
  if (pongScoreUI) { 
    pongScoreUI.dispose(); 
    pongScoreUI = null as any; 
  }
  if (pongGraphics) {
    pongGraphics.dispose();
    pongGraphics = null as any;
  }
}

// Light creation is now handled by PongGraphics class

function setupPongScene(scene: Scene) {
	// Initialize PongGraphics
	if (!pongGraphics) {
		pongGraphics = new PongGraphics(scene);
	}

	// Setup scene and camera using PongGraphics
	pongGraphics.setupSceneAndCamera(playArea, canvasEl);

	// Create all game objects using PongGraphics
	const gameObjects = pongGraphics.setupPongGameObjects(playArea, getBallSize, getPaddleWidth, getPaddleHeight);
	
	// Assign to game state variables
	paddle1.mesh = gameObjects.paddle1;
	paddle2.mesh = gameObjects.paddle2;
	ball.mesh = gameObjects.ball;

	// Setup lights
	lights.length = 0; // Clear existing lights
	lights.push(...gameObjects.lights);

	// Setup lighting animation
	if (lightsAnimObserver) { 
		scene.onBeforeRenderObservable.remove(lightsAnimObserver); 
		lightsAnimObserver = null; 
	}
	lightsAnimObserver = scene.onBeforeRenderObservable.add(() => {
		if (pongGraphics) {
			pongGraphics.animateLights(lights, frameCount);
		}
	});
}

// Score UI setup is now handled by the PongScoreUI class in drawScores()


function drawScores() {
  const canvas = canvasEl;
  const rect = canvas.getBoundingClientRect();
  if (rect.width !== playArea.width || rect.height !== playArea.height) {
    playArea.width = rect.width;
    playArea.height = rect.height;
  }

  if (!pongScoreUI) {
    pongScoreUI = new PongScoreUI(canvas, scene);
  }
  
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

	// Use getBoundingClientRect to get actual display size, not just canvas.width/height
	const rect = canvasEl.getBoundingClientRect();
	
	// Constrain dimensions to viewport to prevent overflow
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

	// Store the base speed for this game to prevent drift across matches
	baseSpeed = playArea.width * 0.0075;
	ball.dx = 0;
	ball.dy = 0;

	setupPongScene(scene);
	
	// Initialize graphics if not already done
	if (!pongGraphics) {
		pongGraphics = new PongGraphics(scene);
	}

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
		if (!isRunning) return;
		const rect = canvasEl.getBoundingClientRect();
		const newWidth = rect.width;
		const newHeight = rect.height;
		const newTopMargin = newHeight * 0.08;
		const newBottomMargin = newHeight * 0.08;
		
		playArea = {
			y: newTopMargin,
			width: newWidth,
			height: newHeight - newTopMargin - newBottomMargin
		};
		// Resize will be handled by recreating the score UI in drawScores()
		if (pongScoreUI) {
			pongScoreUI.dispose();
			pongScoreUI = null as any;
		}
	};
	
	window.addEventListener('resize', handleResize);

	// Ensure no duplicate observers from previous matches
	if (updateObserver) { scene.onBeforeRenderObservable.remove(updateObserver); updateObserver = null; }
	updateObserver = scene.onBeforeRenderObservable.add(() => {
		if (!isRunning) return;
		update();
	});
}

export function stopPong() { isRunning = false; removeInput(); }
