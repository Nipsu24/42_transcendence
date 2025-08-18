import { TournamentManager, Match } from './TournamentManager.js';
import { startPongMatch } from './pong.js';

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let tm: TournamentManager;
let onTournamentEnd: (() => void) | null = null;

const nextMatchButton = { x: 300, y: 500, width: 200, height: 50 };
const endTournamentButton = { x: 300, y: 500, width: 200, height: 50 };

let clickHandler: ((e: MouseEvent) => void) | null = null;

let isMatchInProgress = false;
let tournamentEnded = false;
let bracketLoopId: number | null = null;

export function startTournament(
  canvasEl: HTMLCanvasElement,
  ctxEl: CanvasRenderingContext2D,
  players: string[],
  onEndCallback?: () => void,
  onReturnToMenu?: () => void
) {
  canvas = canvasEl;
  ctx = ctxEl;
  tm = new TournamentManager(players);

  isMatchInProgress = false;
  tournamentEnded = false;

  onTournamentEnd = onEndCallback || null;

  cleanupListeners();

  clickHandler = (e) => handleClick(e, onReturnToMenu);
  canvas.addEventListener('click', clickHandler);

  startBracketLoop();
}

function drawBracket() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'white';
  ctx.font = '32px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Tournament Bracket', canvas.width / 2, 50);

  const matches = tm.currentRound;
  const startY = 100;
  const spacing = 60;

  matches.forEach((match, i) => {
    const y = startY + i * spacing;
    const x1 = canvas.width / 2 - 150;
    const x2 = canvas.width / 2 + 50;

    ctx.textAlign = 'left';

    ctx.fillStyle = match.winner === match.player1 ? 'lightgreen' : 'white';
    ctx.fillText(match.player1, x1, y);

    ctx.fillStyle = match.player2 && match.winner === match.player2 ? 'lightgreen' : 'white';
    ctx.fillText(match.player2 || '(bye)', x2, y);
  });

  if (!tm.isFinished() && tm.hasNextMatch()) {

    ctx.fillStyle = 'white';
    ctx.fillRect(nextMatchButton.x, nextMatchButton.y, nextMatchButton.width, nextMatchButton.height);

    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Start Match', nextMatchButton.x + nextMatchButton.width / 2, nextMatchButton.y + 33);
  }

  if (tm.isFinished()) {
    tournamentEnded = true;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.fillStyle = 'gold';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`🏆 Champion: ${tm.getChampion()}`, centerX, centerY - 40);

    ctx.fillStyle = 'white';
    ctx.fillRect(endTournamentButton.x, endTournamentButton.y, endTournamentButton.width, endTournamentButton.height);

    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText('End Tournament', endTournamentButton.x + endTournamentButton.width / 2, endTournamentButton.y + endTournamentButton.height / 2);
  }
}

function startBracketLoop() {
  if (bracketLoopId !== null) return;

  function loop() {
    drawBracket();
    bracketLoopId = requestAnimationFrame(loop);
  }

  loop();
}

function stopBracketLoop() {
  if (bracketLoopId !== null) {
    cancelAnimationFrame(bracketLoopId);
    bracketLoopId = null;
  }
}

function handleClick(e: MouseEvent, onReturnToMenu?: () => void) {
  if (isMatchInProgress) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (!tournamentEnded) {
    if (
      x >= nextMatchButton.x &&
      x <= nextMatchButton.x + nextMatchButton.width &&
      y >= nextMatchButton.y &&
      y <= nextMatchButton.y + nextMatchButton.height
    ) {
      startNextMatch();
      return;
    }
  } else {
    if (
      x >= endTournamentButton.x &&
      x <= endTournamentButton.x + endTournamentButton.width &&
      y >= endTournamentButton.y &&
      y <= endTournamentButton.y + endTournamentButton.height
    ) {
      endTournament();

      if (onReturnToMenu) onReturnToMenu();
      return;
    }
  }
}

function startNextMatch() {
  const match = tm.getNextMatch();
  if (!match || !match.player1 || !match.player2) {
    return;
  }

  isMatchInProgress = true;
  stopBracketLoop();

  startPongMatch(canvas, ctx, false, match.player1, match.player2, (winner) => {
    tm.recordWinner(winner);

    isMatchInProgress = false;
    startBracketLoop();
  });
}

function endTournament() {
  cleanupListeners();
  stopBracketLoop();

  if (onTournamentEnd) {
    onTournamentEnd();
  }
}

function cleanupListeners() {
  if (clickHandler) {
    canvas.removeEventListener('click', clickHandler);
    clickHandler = null;
  }
}
