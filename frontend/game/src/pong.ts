import { createRecord } from './apiCalls.js';

let isRunning = false;
let isAi = false;
// let cycle = 0;
// let fps = 60;
let aiTargetY: number | null = null;
let aiDecisionTime = 0;
let aiDecisionInterval = 1000;

let leftScore = 0, rightScore = 0;
const maxScore = 10;

const paddle1 = { x: 10, y: 0, dy: 0 };
const paddle2 = { x: 0, y: 0, dy: 0 };
const ball = { x: 0, y: 0, dx: 6, dy: 6 };
const speedMod = 1.02;

let WIDTH: number, HEIGHT: number;
let ctx: CanvasRenderingContext2D;

let winnerCallback: ((winner: string, leftScore: number, rightScore: number) => void) | null = null;
let player1Name: string, player2Name: string;

let playArea: { x: number; y: number; width: number; height: number };

function getPaddleWidth() { return WIDTH * 0.0125; }
function getPaddleHeight() { return HEIGHT * 0.1333; }
function getBallSize() { return WIDTH * 0.015; }

function getBallSpeed() { return WIDTH * 0.0075; }
function getPaddleSpeed() { return HEIGHT * 0.01; }

// Key handling
function setupInput() {
  document.addEventListener('keydown', keyDownHandler);
  document.addEventListener('keyup', keyUpHandler);
}

function removeInput() {
  document.removeEventListener('keydown', keyDownHandler);
  document.removeEventListener('keyup', keyUpHandler);
}

function keyDownHandler(e: KeyboardEvent) {
  if (e.key === 'w') paddle1.dy = -getPaddleSpeed();
  if (e.key === 's') paddle1.dy = getPaddleSpeed();
  if (e.key === 'ArrowUp' && !isAi) paddle2.dy = -getPaddleSpeed();
  if (e.key === 'ArrowDown' && !isAi) paddle2.dy = getPaddleSpeed();
}

function keyUpHandler(e: KeyboardEvent) {
  if (e.key === 'w' || e.key === 's') paddle1.dy = 0;
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') paddle2.dy = 0;
  if (e.key === 'Escape') endMatch("");
}

function resetBall() {
  ball.x = WIDTH / 2;
  ball.y = playArea.height / 2;
  let initialSpeed = getBallSpeed();
  aiDecisionInterval = 1000;
  
  ball.dx = Math.random() < 0.5 ? -initialSpeed : initialSpeed;

  let angle = 0;
  do {
    angle = Math.random() * getBallSpeed() - getBallSpeed() / 2;
  } while (Math.abs(angle) < getBallSpeed() / 6);
  ball.dy = angle;
}

function predictBallY(): number {
  let simX = ball.x;
  let simY = ball.y;
  let simDx = ball.dx;
  let simDy = ball.dy;

  while (simDx > 0 && simX < paddle2.x - getBallSize())
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
    aiTargetY = playArea.height / 2;
}

function controlAI() {
  if (aiTargetY === null) return;

  const paddleMiddle = paddle2.y + getPaddleHeight() / 2;

  if (Math.abs(aiTargetY - paddleMiddle) < getPaddleSpeed())
    paddle2.dy = 0;
  else if (aiTargetY < paddleMiddle)
    paddle2.dy = -getPaddleSpeed();
  else
    paddle2.dy = getPaddleSpeed();
}

// function updateCycle() {
//   if (cycle++ >= fps)
//     cycle = 0;
//   return cycle;
// }

async function update() {
  paddle1.y += paddle1.dy;
  paddle2.y += paddle2.dy;

  if (isAi)
  {
    aiBehavior();
    controlAI();
  }

  paddle1.y = Math.max(playArea.y, Math.min(playArea.y + playArea.height - getPaddleHeight(), paddle1.y));
  paddle2.y = Math.max(playArea.y, Math.min(playArea.y + playArea.height - getPaddleHeight(), paddle2.y));

  ball.x += ball.dx;
  ball.y += ball.dy;

  if (ball.y < playArea.y || ball.y > playArea.y + playArea.height - getBallSize()) ball.dy *= -1;

  if (
    ball.x < paddle1.x + getPaddleWidth() &&
    ball.y > paddle1.y &&
    ball.y < paddle1.y + getPaddleHeight()
  ) {
    ball.dx *= -speedMod;
    aiDecisionInterval -= 2;
    ball.x = paddle1.x + getPaddleWidth();
  }

  if (
    ball.x + getBallSize() > paddle2.x &&
    ball.y > paddle2.y &&
    ball.y < paddle2.y + getPaddleHeight()
  ) {
    ball.dx *= -speedMod;
    aiDecisionInterval -= 2;
    ball.x = paddle2.x - getBallSize();
  }

  if (ball.x < 0) {
    rightScore = Math.min(maxScore, rightScore + 1);
    if (rightScore >= maxScore) {
      // await createRecord({ resultPlayerOne: leftScore, resultPlayerTwo: rightScore, aiOpponent: isAi });
      endMatch(player2Name);
    }
    else resetBall();
  }

  if (ball.x > WIDTH) {
    leftScore = Math.min(maxScore, leftScore + 1);
    if (leftScore >= maxScore) {
      // await createRecord({ resultPlayerOne: leftScore, resultPlayerTwo: rightScore, aiOpponent: isAi });
      endMatch(player1Name);
    }
    else resetBall();
  }
}


function drawRect(x: number, y: number, w: number, h: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawBall() {
  drawRect(ball.x, ball.y, getBallSize(), getBallSize(), 'white');
}

function drawPaddles() {
  drawRect(paddle1.x, paddle1.y, getPaddleWidth(), getPaddleHeight(), 'white');
  drawRect(paddle2.x, paddle2.y, getPaddleWidth(), getPaddleHeight(), 'white');
}

function drawScores() {
  ctx.fillStyle = 'white';
  ctx.font = (WIDTH > 400) ? '24px Arial' : '12px Arial';
  ctx.textAlign = 'center';

  const scoreY = 28;
  ctx.fillText(`${player1Name}: ${leftScore}`, WIDTH / 4, scoreY);
  ctx.fillText(`${player2Name}: ${rightScore}`, (WIDTH * 3) / 4, scoreY);
}

function drawBorder() {
  const scoreBarHeight = 40;
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 4;
  ctx.strokeRect(0, scoreBarHeight, playArea.width, playArea.height);
}

function draw() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  drawPaddles();
  drawBall();
  drawScores();
  drawBorder();
}

function endMatch(winner: string) {
  isRunning = false;
  removeInput();

  if (winnerCallback) {
    winnerCallback(winner, leftScore, rightScore);
    winnerCallback = null;
  }
}

/**
 * Starts a Pong match between two players.
 * Ends automatically when one scores 10 points.
 * 
 * @param canvas - The canvas element.
 * @param context - 2D canvas context.
 * @param ai - True if 1 player game.
 * @param p1 - Name of player 1 (left side).
 * @param p2 - Name of player 2 (right side).
 * @param onMatchEnd - Callback called with winner's name.
 */
export function startPongMatch(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  ai: boolean,
  p1: string,
  p2: string,
  onMatchEnd: (winner: string, leftScore: number, rightScore: number) => void
) {
  WIDTH = canvas.width;
  HEIGHT = canvas.height;
  playArea = {
    x: 0,
    y: 40,
    width: WIDTH,
    height: HEIGHT - 40
  };

  ctx = context;

  if (ai)
    isAi = true;
  else
    isAi = false;


  player1Name = p1;
  player2Name = (isAi) ? "AI player" : p2;
  winnerCallback = onMatchEnd;

  paddle1.y = HEIGHT / 2 - getPaddleHeight() / 2;
  paddle2.x = WIDTH - 20;
  paddle2.y = HEIGHT / 2 - getPaddleHeight() / 2;

  leftScore = 0;
  rightScore = 0;
  resetBall();

  isRunning = true;
  setupInput();

  requestAnimationFrame(function gameLoop() {
    if (!isRunning) return;
    update();
    draw();
    requestAnimationFrame(gameLoop);
  });
}

export function stopPong() {
  isRunning = false;
  removeInput();
}
