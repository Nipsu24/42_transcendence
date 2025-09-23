import { TournamentManager } from './TournamentManager.js';
import { startPongMatch } from './pong.js';

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let tm: TournamentManager;
let onTournamentEnd: (() => void) | null = null;

let clickHandler: ((e: MouseEvent) => void) | null = null;

let isMatchInProgress = false;
let tournamentEnded = false;
let bracketLoopId: number | null = null;

let nextMatchButton: { x: number; y: number; width: number; height: number };
let endTournamentButton: { x: number; y: number; width: number; height: number };

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

  const buttonWidth = canvas.width * 0.25;
  const buttonHeight = canvas.height * 0.1;
  const buttonX = canvas.width / 2 - buttonWidth / 2;

  nextMatchButton = {
    x: buttonX,
    y: canvas.height * 0.8,
    width: buttonWidth,
    height: buttonHeight,
  };

  endTournamentButton = {
    x: buttonX,
    y: canvas.height * 0.8,
    width: buttonWidth,
    height: buttonHeight,
  };

  cleanupListeners();

  clickHandler = (e) => handleClick(e, onReturnToMenu);
  canvas.addEventListener('click', clickHandler);

  startBracketLoop();
}

function drawBracket() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBorder();

  ctx.fillStyle = 'white';
  ctx.font = `${Math.floor(canvas.height * 0.05)}px Arial`;
  ctx.textAlign = 'center';
  ctx.fillText('Tournament Bracket', canvas.width / 2, canvas.height * 0.1);

  const matches = tm.currentRound;
  const startY = canvas.height * 0.15;
  const spacing = canvas.height * 0.07;

  matches.forEach((match, i) => {
    const y = startY + i * spacing;
    const x1 = canvas.width / 2 - canvas.width * 0.25;
    const x2 = canvas.width / 2 + canvas.width * 0.05;

    ctx.textAlign = 'left';
    ctx.font = `${Math.floor(canvas.height * 0.035)}px Arial`;

    ctx.fillStyle = match.winner === match.player1 ? 'lightgreen' : 'white';
    ctx.fillText(match.player1, x1, y);

    ctx.fillStyle = match.player2 && match.winner === match.player2 ? 'lightgreen' : 'white';
    ctx.fillText(match.player2 || '(bye)', x2, y);
  });

  if (!tm.isFinished() && tm.hasNextMatch()) {
    drawButton(nextMatchButton, 'Start Match');
  }

  if (tm.isFinished()) {
    tournamentEnded = true;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.fillStyle = 'gold';
    ctx.font = `${Math.floor(canvas.height * 0.07)}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText(`🏆 Champion: ${tm.getChampion()}`, centerX, centerY - canvas.height * 0.1);

    drawButton(endTournamentButton, 'End Tournament');
  }
}

function drawButton(btn: { x: number; y: number; width: number; height: number }, text: string) {
  ctx.fillStyle = 'white';
  ctx.fillRect(btn.x, btn.y, btn.width, btn.height);

  ctx.fillStyle = 'black';
  ctx.font = `${Math.floor(canvas.height * 0.04)}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, btn.x + btn.width / 2, btn.y + btn.height / 2);
}

function drawBorder() {
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 4;
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
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

  startPongMatch(canvas, ctx, false, match.player1, match.player2, (winner, leftScore, rightScore) => {
    tm.recordWinner(winner, leftScore, rightScore);

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

export function cleanupTournament() {
  cleanupListeners();
  stopBracketLoop();
}