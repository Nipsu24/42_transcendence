import { Button } from './Button.js';
import { startTournament } from './tournament.js';
import { startMenu } from './menu.js';

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;

let players: string[] = [];
let buttons: Button[] = [];

let clickHandler: (e: MouseEvent) => void;
let moveHandler: (e: MouseEvent) => void;

const MIN_PLAYERS = 3;
const MAX_PLAYERS = 16;

export function startTournamentMenu(canvasEl: HTMLCanvasElement, ctxEl: CanvasRenderingContext2D) {
  canvas = canvasEl;
  ctx = ctxEl;
  players = [];

  setupButtons();
  cleanupListeners();

  clickHandler = (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    buttons.forEach(btn => {
      if (btn.isClicked(x, y)) btn.onClick();
    });
  };

  moveHandler = (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    buttons.forEach(btn => btn.hovered = btn.isHovered(x, y));
    drawMenu();
  };

  canvas.addEventListener('click', clickHandler);
  canvas.addEventListener('mousemove', moveHandler);

  drawMenu();
}

function setupButtons() {
  let y = 200;
  const space = 70;

  buttons = [
    new Button(300, y, 200, 50, 'Add Player', () => {
      if (players.length >= MAX_PLAYERS) {
        alert(`Maximum of ${MAX_PLAYERS} players reached.`);
        return;
      }
      players.push(`Player ${players.length + 1}`);
      drawMenu();
    }),
    new Button(300, y += space, 200, 50, 'Remove Player', () => {
      if (players.length === 0) return;
      players.pop();
      drawMenu();
    }),
    new Button(300, y += space, 200, 50, 'Start Tournament', () => {
      if (players.length < MIN_PLAYERS) {
        alert(`At least ${MIN_PLAYERS} players required!`);
        return;
      }
      cleanupListeners();
      startTournament(canvas, ctx, players, () => {

        startMenu(canvas, ctx);
      });
    }),
    new Button(300, y += space, 200, 50, 'Back', () => {
      cleanupListeners();
      startMenu(canvas, ctx);
    }),
  ];
}

function drawMenu() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'white';
  ctx.font = '40px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Tournament Setup', canvas.width / 2, 80);

  ctx.font = '24px Arial';
  ctx.textAlign = 'left';
  players.forEach((name, i) => {
    ctx.fillText(name, 50, 140 + i * 30);
  });

  buttons.forEach(btn => btn.draw(ctx));
}

function cleanupListeners() {
  if (clickHandler) canvas.removeEventListener('click', clickHandler);
  if (moveHandler) canvas.removeEventListener('mousemove', moveHandler);
}
