let isRunning = false;

const paddleWidth = 10, paddleHeight = 80, ballSize = 12;
let leftScore = 0, rightScore = 0;

const paddle1 = { x: 10, y: 0, dy: 0 };
const paddle2 = { x: 0, y: 0, dy: 0 };
const ball = { x: 0, y: 0, dx: 6, dy: 6 };

let WIDTH: number, HEIGHT: number;
let ctx: CanvasRenderingContext2D;

/**
 * Initializes and starts the game loop.
 * @param canvas - The canvas element used to draw the game.
 * @param context - The 2D rendering context from the canvas.
 */
export function startPong(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
  WIDTH = canvas.width;
  HEIGHT = canvas.height;
  ctx = context;

  paddle1.y = HEIGHT / 2 - paddleHeight / 2;
  paddle2.x = WIDTH - 20;
  paddle2.y = HEIGHT / 2 - paddleHeight / 2;

  leftScore = 0;
  rightScore = 0;
  resetBall();

  isRunning = true;
  requestAnimationFrame(gameLoop);

  function gameLoop() {
    if (!isRunning) return;
    update();
    draw();
    requestAnimationFrame(gameLoop);
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
    ctx.fillText(`${leftScore}`, WIDTH / 4, 50);
    ctx.fillText(`${rightScore}`, WIDTH * 3 / 4, 50);
  }

  function resetBall() {
    ball.x = WIDTH / 2;
    ball.y = HEIGHT / 2;
    const initialSpeed = 6;
    ball.dx = Math.random() < 0.5 ? -initialSpeed : initialSpeed;

    // Avoid near-zero vertical angles
    let angle = 0;
    do {
      angle = Math.random() * 8 - 4;
    } while (Math.abs(angle) < 1);

    ball.dy = angle;
  }

  function update() {
    paddle1.y += paddle1.dy;
    paddle2.y += paddle2.dy;

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
      ball.dx *= -1;
      ball.x = paddle1.x + paddleWidth;
    }

    if (
      ball.x + ballSize > paddle2.x &&
      ball.y > paddle2.y &&
      ball.y < paddle2.y + paddleHeight
    ) {
      ball.dx *= -1;
      ball.x = paddle2.x - ballSize;
    }

    if (ball.x < 0) {
      rightScore++;
      resetBall();
    }

    if (ball.x > WIDTH) {
      leftScore++;
      resetBall();
    }
  }

  function draw() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    drawPaddles();
    drawBall();
    drawScores();
  }
}

export function stopPong() {
  isRunning = false;
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'w') paddle1.dy = -6;
  if (e.key === 's') paddle1.dy = 6;
  if (e.key === 'ArrowUp') paddle2.dy = -6;
  if (e.key === 'ArrowDown') paddle2.dy = 6;
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'w' || e.key === 's') paddle1.dy = 0;
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') paddle2.dy = 0;
});
