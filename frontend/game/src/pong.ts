const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const paddleWidth = 10, paddleHeight = 80, ballSize = 12;
let leftScore = 0, rightScore = 0;

const paddle1 = { x: 10, y: HEIGHT / 2 - paddleHeight / 2, dy: 0 };
const paddle2 = { x: WIDTH - 20, y: HEIGHT / 2 - paddleHeight / 2, dy: 0 };
const ball = { x: WIDTH / 2, y: HEIGHT / 2, dx: 6, dy: 6 };

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
  ball.dx = -ball.dx;
  ball.dy = (Math.random() * 8 - 4);
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

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
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

gameLoop();
