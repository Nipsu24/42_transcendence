import { launchGame } from './main.js';
import { Button } from './Button.js';
import { startTournamentMenu } from './tournamentMenu.js';

/**
 * Starts the main menu, rendering buttons and handling interaction.
 * 
 * @param canvas - The canvas element where the menu is drawn.
 * @param ctx - The 2D drawing context for the canvas.
 */

export function startMenu(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  let y = 200;
  const space = 80;

  const buttons: Button[] = [
    new Button(300, y, 200, 50, '1 Player', () => alert('1 player')),
    new Button(300, y += space, 200, 50, '2 Players', () => {
      cleanup();
      launchGame();
    }),
    new Button(300, y += space, 200, 50, 'Tournament', () => {
      cleanup();
      startTournamentMenu(canvas, ctx);
    }),
    new Button(300, y += space, 200, 50, 'Quit', () => alert('Quit')),
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

  function drawMenu() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Pong', canvas.width / 2, 150);

    buttons.forEach(button => button.draw(ctx));
  }

  drawMenu();
}
