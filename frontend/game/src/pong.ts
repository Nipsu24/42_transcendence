let isRunning = false;
let isAi = false;
let cycle = 0;
let fps = 60;
let aiTargetY: number | null = null;
let aiDecisionTime = 0;
let aiDecisionInterval = 1000;

const paddleWidth = 10, paddleHeight = 80, ballSize = 12;
let leftScore = 0, rightScore = 0;

const paddle1 = { x: 10, y: 0, dy: 0 };
const paddle2 = { x: 0, y: 0, dy: 0 };
const ball = { x: 0, y: 0, dx: 6, dy: 6 };
const speedMod = 1.02;

let WIDTH: number, HEIGHT: number;
let ctx: CanvasRenderingContext2D;

let winnerCallback: ((winner: string) => void) | null = null;
let player1Name: string, player2Name: string;

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
  if (e.key === 'w') paddle1.dy = -6;
  if (e.key === 's') paddle1.dy = 6;
  if (e.key === 'ArrowUp' && !isAi) paddle2.dy = -6;
  if (e.key === 'ArrowDown' && !isAi) paddle2.dy = 6;
}

function keyUpHandler(e: KeyboardEvent) {
  if (e.key === 'w' || e.key === 's') paddle1.dy = 0;
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') paddle2.dy = 0;
}

function resetBall() {
  ball.x = WIDTH / 2;
  ball.y = HEIGHT / 2;
  const initialSpeed = 6;
  aiDecisionInterval = 1000;
  
  ball.dx = Math.random() < 0.5 ? -initialSpeed : initialSpeed;

  let angle = 0;
  do {
    angle = Math.random() * 8 - 4;
  } while (Math.abs(angle) < 1);

  ball.dy = angle;
}

// function getRandomInt (min: number, max: number) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }

function predictBallY(): number {
  let simX = ball.x;
  let simY = ball.y;
  let simDx = ball.dx;
  let simDy = ball.dy;

  while (simDx > 0 && simX < paddle2.x - ballSize)
  {
    simX += simDx;
    simY += simDy;

    if (simY < 0 || simY > HEIGHT - ballSize)
      simDy *= -1;
  }

  return simY + ballSize / 2;
}

function aiBehavior() {
  const now = performance.now();

  if (now - aiDecisionTime < aiDecisionInterval) return;
  aiDecisionTime = now;

  aiTargetY = predictBallY();
  if (ball.dx < 0)
    aiTargetY = HEIGHT / 2;
}

function controlAI() {
  if (aiTargetY === null) return;

  const paddleMiddle = paddle2.y + paddleHeight / 2;

  if (Math.abs(aiTargetY - paddleMiddle) < 6)
    paddle2.dy = 0;
  else if (aiTargetY < paddleMiddle)
    paddle2.dy = -6;
  else
    paddle2.dy = 6;
}

// function updateCycle() {
//   if (cycle++ >= fps)
//     cycle = 0;
//   return cycle;
// }

function update() {
  paddle1.y += paddle1.dy;
  paddle2.y += paddle2.dy;

  if (isAi)
  {
    aiBehavior();
    controlAI();
  }

  paddle1.y = Math.max(0, Math.min(HEIGHT - paddleHeight, paddle1.y));
  paddle2.y = Math.max(0, Math.min(HEIGHT - paddleHeight, paddle2.y));

  ball.x += ball.dx;
  ball.y += ball.dy;

  if (ball.y < 0 || ball.y > HEIGHT - ballSize) ball.dy *= -1;

  if (
    ball.x < paddle1.x + paddleWidth &&
    ball.y > paddle1.y &&
    ball.y < paddle1.y + paddleHeight
  ) {
    ball.dx *= -speedMod;
    aiDecisionInterval -= 2;
    ball.x = paddle1.x + paddleWidth;
  }

  if (
    ball.x + ballSize > paddle2.x &&
    ball.y > paddle2.y &&
    ball.y < paddle2.y + paddleHeight
  ) {
    ball.dx *= -speedMod;
    aiDecisionInterval -= 2;
    ball.x = paddle2.x - ballSize;
  }

  if (ball.x < 0) {
    rightScore++;
    if (rightScore >= 10) endMatch(player2Name);
    else resetBall();
  }

  if (ball.x > WIDTH) {
    leftScore++;
    if (leftScore >= 10) endMatch(player1Name);
    else resetBall();
  }
}


function drawRect(x: number, y: number, w: number, h: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawBall() {
  drawRect(ball.x, ball.y, ballSize, ballSize, 'white');
}

function drawPaddles() {
  drawRect(paddle1.x, paddle1.y, paddleWidth, paddleHeight, 'white');
  drawRect(paddle2.x, paddle2.y, paddleWidth, paddleHeight, 'white');
}

function drawScores() {
  ctx.fillStyle = 'white';
  ctx.font = '32px Arial';
  ctx.fillText(`${player1Name}: ${leftScore}`, WIDTH / 4, 50);
  ctx.fillText(`${player2Name}: ${rightScore}`, WIDTH * 3 / 4, 50);
}

function draw() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  drawPaddles();
  drawBall();
  drawScores();
}

function endMatch(winner: string) {
  isRunning = false;
  removeInput();

  if (winnerCallback) {
    winnerCallback(winner);
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
  onMatchEnd: (winner: string) => void
) {
  WIDTH = canvas.width;
  HEIGHT = canvas.height;
  ctx = context;

  if (ai)
    isAi = true;
  else
    isAi = false;

  player1Name = p1;
  player2Name = (isAi) ? "AI player" : p2;
  winnerCallback = onMatchEnd;

  paddle1.y = HEIGHT / 2 - paddleHeight / 2;
  paddle2.x = WIDTH - 20;
  paddle2.y = HEIGHT / 2 - paddleHeight / 2;

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
