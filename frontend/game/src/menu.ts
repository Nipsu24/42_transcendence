import { Button } from './Button.js';
import { startTournamentMenu } from './tournamentMenu.js';
import { startPongMatch } from './pong.js';
import { getMe } from './apiCalls.js';
import { updateMyStats } from "./apiCalls.js";

export async function startMenu(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  onQuit?: () => void
) {
  const buttonWidth = canvas.width * 0.25;
  const buttonHeight = canvas.height * 0.10;
  const buttonX = canvas.width / 2 - buttonWidth / 2;
  let y = canvas.height * 0.25;
  const space = canvas.height * 0.15;

  let player1Name = "Player 1";
  try {
    const me = await getMe();
    player1Name = me.name;
  } catch (err) {
    console.error("Could not fetch user:", err);
  }

  const buttons: Button[] = [
    new Button(buttonX, y, buttonWidth, buttonHeight, '1 Player', () => {
      cleanup();
      startPongMatch(canvas, ctx, true, player1Name, 'AI player', async (winner) => {
        const me = await getMe();
        if (winner !== "") alert(`${winner} wins!`);
        if (winner === player1Name) {
          await updateMyStats({ victories: me.stats.victories + 1, defeats: me.stats.defeats });
        } else {
          await updateMyStats({ victories: me.stats.victories, defeats: me.stats.defeats + 1 });
        }
        startMenu(canvas, ctx, onQuit);
      });
    }),

    new Button(buttonX, (y += space), buttonWidth, buttonHeight, '2 Players', () => {
      cleanup();
      startPongMatch(canvas, ctx, false, player1Name, 'Player 2', (winner) => {
        if (winner !== "") alert(`${winner} wins!`);
        startMenu(canvas, ctx, onQuit);
      });
    }),

    new Button(buttonX, (y += space), buttonWidth, buttonHeight, 'Tournament', () => {
      cleanup();
      startTournamentMenu(canvas, ctx, onQuit);
    }),

    new Button(buttonX, (y += space), buttonWidth, buttonHeight, 'Quit', () => {
      cleanup();
      if (onQuit) onQuit();
    }),
  ];

  const handleClick = (e: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    buttons.forEach(button => {
      if (button.isClicked(x, y)) button.onClick();
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    buttons.forEach(button => {
      button.hovered = button.isHovered(mx, my);
    });

    drawMenu();
  };

  canvas.addEventListener('click', handleClick);
  canvas.addEventListener('mousemove', handleMouseMove);

  function cleanup() {
    canvas.removeEventListener('click', handleClick);
    canvas.removeEventListener('mousemove', handleMouseMove);
  }

  function drawBorder() {
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
  }

  function drawMenu() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBorder();

    ctx.fillStyle = 'white';
    ctx.font = `${Math.floor(canvas.height * 0.08)}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('Pong', canvas.width / 2, canvas.height * 0.2);

    ctx.font = `${Math.floor(canvas.height * 0.05)}px Arial`;
    ctx.fillText(`Welcome, ${player1Name}`, canvas.width / 2, canvas.height * 0.1);

    buttons.forEach(button => button.draw(ctx));
  }

  drawMenu();
}
