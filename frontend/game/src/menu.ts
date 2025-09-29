import { Button } from './Button.js';
import { startTournamentMenu } from './tournamentMenu.js';
import { startPongMatch } from './pong.js';
import { getMe } from '../../src/services/players.js';
import { createRecord } from './apiCalls.js';

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
      startPongMatch(canvas, ctx, true, player1Name, 'AI player', async (winner, leftScore, rightScore) => {
        const me = await getMe();
        if (winner !== "") {
          alert(`${winner} wins!`);
          await createRecord({
            playerOneName: player1Name,
            resultPlayerOne: leftScore,
            resultPlayerTwo: rightScore,
            aiOpponent: true
          });
        }
        startMenu(canvas, ctx, onQuit);
      });
    }),

    new Button(buttonX, (y += space), buttonWidth, buttonHeight, '2 Players', async () => {
      cleanup();

      const me = await getMe();
      if (!me.friends || me.friends.length === 0) {
        alert("You have no friends to play against. Add some first!");
        startMenu(canvas, ctx, onQuit);
        return;
      }

      const friendNames = me.friends.map(f => f.name).join(", ");
      const chosen = prompt(`Choose an opponent: ${friendNames}`);

      const opponent = me.friends.find(f => f.name === chosen);
      if (!opponent) {
        alert("Invalid selection.");
        startMenu(canvas, ctx, onQuit);
        return;
      }
      startPongMatch(canvas, ctx, false, me.name, opponent.name, async (winner, leftScore, rightScore) => {
        if (winner !== "") {
          alert(`${winner} wins!`);
          await createRecord({
            playerOneName: player1Name,
            playerTwoName: opponent.name,
            resultPlayerOne: leftScore,
            resultPlayerTwo: rightScore,
            aiOpponent: false
          });
        }
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
