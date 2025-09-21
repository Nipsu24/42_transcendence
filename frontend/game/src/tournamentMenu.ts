import { Button } from './Button.js';
import { startTournament, cleanupTournament } from './tournament.js';
import { startMenu } from './menu.js';
import { getMe } from '../../src/services/players.js';

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;

let players: string[] = [];
let buttons: Button[] = [];

let clickHandler: (e: MouseEvent) => void;
let moveHandler: (e: MouseEvent) => void;

const MIN_PLAYERS = 3;
const MAX_PLAYERS = 16;

let me: any; // store logged-in user

export async function startTournamentMenu(
  canvasEl: HTMLCanvasElement,
  ctxEl: CanvasRenderingContext2D,
  onQuit?: () => void
) {
  canvas = canvasEl;
  ctx = ctxEl;
  players = [];

  // fetch current user and add automatically
  me = await getMe();
  players.push(me.name);

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
    new Button(buttonX, y, buttonWidth, buttonHeight, 'Add Friend', () => {
      if (players.length >= MAX_PLAYERS) {
        alert(`Maximum of ${MAX_PLAYERS} players reached.`);
        return;
      }
      if (!me.friends || me.friends.length === 0) {
        alert("You have no friends to add. Add some first!");
        return;
      }

      const friendNames = me.friends.map(f => f.name).join(", ");
      const chosen = prompt(`Choose a friend to add: ${friendNames}`);

      const friend = me.friends.find(f => f.name === chosen);
      if (!friend) {
        alert("Invalid selection.");
        return;
      }
      if (players.includes(friend.name)) {
        alert(`${friend.name} is already in the tournament.`);
        return;
      }

      players.push(friend.name);
      drawMenu();
    }),
    new Button(buttonX, (y += space), buttonWidth, buttonHeight, 'Remove Last', () => {
      if (players.length <= 1) {
        alert("You cannot remove yourself from the tournament.");
        return;
      }
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
    ctx.fillText(name, canvas.width * 0.20, canvas.height * 0.25 + i * (canvas.height * 0.05));
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
