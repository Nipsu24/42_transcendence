import { Button } from './Button.js';
import { startTournament, cleanupTournament } from './tournament.js';
import { startMenu } from './menu.js';

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;

let players: string[] = [];
let buttons: Button[] = [];

let clickHandler: (e: MouseEvent) => void;
let moveHandler: (e: MouseEvent) => void;

const MIN_PLAYERS = 3;
const MAX_PLAYERS = 16;

export function startTournamentMenu(
  canvasEl: HTMLCanvasElement,
  ctxEl: CanvasRenderingContext2D,
  onQuit?: () => void
) {
  canvas = canvasEl;
  ctx = ctxEl;
  players = [];

  setupButtons(onQuit);
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

function setupButtons(onQuit?: () => void) {
  const buttonWidth = canvas.width * 0.25;
  const buttonHeight = canvas.height * 0.10;
  const buttonX = canvas.width / 2 - buttonWidth / 2;
  let y = canvas.height * 0.30;
  const space = canvas.height * 0.15;

  buttons = [
    new Button(buttonX, y, buttonWidth, buttonHeight, 'Add Player', () => {
      if (players.length >= MAX_PLAYERS) {
        alert(`Maximum of ${MAX_PLAYERS} players reached.`);
        return;
      }
      players.push(`Player ${players.length + 1}`);
      drawMenu();
    }),
    new Button(buttonX, (y += space), buttonWidth, buttonHeight, 'Remove Player', () => {
      if (players.length === 0) return;
      players.pop();
      drawMenu();
    }),
    new Button(buttonX, (y += space), buttonWidth, buttonHeight, 'Start Tournament', () => {
      if (players.length < MIN_PLAYERS) {
        alert(`At least ${MIN_PLAYERS} players required!`);
        return;
      }
      cleanupListeners();
      startTournament(canvas, ctx, players, () => {
        startMenu(canvas, ctx, onQuit);
      });
    }),
    new Button(buttonX, (y += space), buttonWidth, buttonHeight, 'Back', () => {
      cleanupTournament();
      startMenu(canvas, ctx, onQuit);
    }),
  ];
}


function drawMenu() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBorder();

  ctx.fillStyle = 'white';
  ctx.font = `${Math.floor(canvas.height * 0.07)}px Arial`;
  ctx.textAlign = 'center';
  ctx.fillText('Tournament Setup', canvas.width / 2, canvas.height * 0.15);

  ctx.font = `${Math.floor(canvas.height * 0.04)}px Arial`;
  ctx.textAlign = 'left';
  players.forEach((name, i) => {
    ctx.fillText(name, canvas.width * 0.1, canvas.height * 0.20 + i * (canvas.height * 0.05));
  });

  buttons.forEach(btn => btn.draw(ctx));
}

function drawBorder() {
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 4;
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

function cleanupListeners() {
  if (clickHandler) canvas.removeEventListener('click', clickHandler);
  if (moveHandler) canvas.removeEventListener('mousemove', moveHandler);
}
