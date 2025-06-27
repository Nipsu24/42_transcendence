import { startMenu } from './menu.js';
import { startPong, stopPong } from './pong.js';

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

let inGame = false;

startMenu(canvas, ctx);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && inGame) {
    stopPong();
    inGame = false;
    startMenu(canvas, ctx);
  }
});

// This is called from menu.js when game starts
export function launchGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  inGame = true;
  startPong(canvas, ctx);
}
