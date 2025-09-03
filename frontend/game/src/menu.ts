import { Button } from './Button.js';
import { startTournamentMenu } from './tournamentMenu.js';
import { startPongMatch } from './pong.js';

export function startMenu(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  onQuit?: () => void
) {
  const buttonWidth = canvas.width * 0.25;
  const buttonHeight = canvas.height * 0.10;
  const buttonX = canvas.width / 2 - buttonWidth / 2;
  let y = canvas.height * 0.25;
  const space = canvas.height * 0.15;

  const buttons: Button[] = [
    new Button(buttonX, y, buttonWidth, buttonHeight, '1 Player', () => {
      cleanup();
      startPongMatch(canvas, ctx, true, 'Player 1', 'AI player', (winner) => {
        if (winner !== "") alert(`${winner} wins!`);
        startMenu(canvas, ctx, onQuit);
      });
    }),
    new Button(buttonX, (y += space), buttonWidth, buttonHeight, '2 Players', () => {
      cleanup();
      startPongMatch(canvas, ctx, false, 'Player 1', 'Player 2', (winner) => {
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

    buttons.forEach(button => button.draw(ctx));
  }

  drawMenu();
}
