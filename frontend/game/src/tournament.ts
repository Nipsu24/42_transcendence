import { startPongMatch } from './3dPong';
import { TournamentManager } from './TournamentManager.js';
import { Scene } from '@babylonjs/core';
import { UIFactory } from './ui/UIFactory';
import { TournamentBracketUI } from './ui/TournamentBracketUI';

let tm: TournamentManager;
let onTournamentEnd: (() => void) | null = null;
let isMatchInProgress = false;
let tournamentEnded = false;

let canvasElement: HTMLCanvasElement;
let uiFactory: UIFactory;
let bracketUI: TournamentBracketUI;
let nextMatchButton: any;
let endTournamentButton: any;
let bracketLoopId: number | null = null;

function hideTournamentUI() {
  if (uiFactory) {
    uiFactory.getUI().rootContainer.isVisible = false;
    uiFactory.getUI().rootContainer.isHitTestVisible = false;
  }
  if (bracketUI) {
    bracketUI.hide();
  }
}

function showTournamentUI() {
  if (uiFactory) {
    uiFactory.getUI().rootContainer.isVisible = true;
    uiFactory.getUI().rootContainer.isHitTestVisible = true;
  }
  if (bracketUI) {
    bracketUI.show();
  }
}

function startBracketLoop() {
  if (bracketLoopId !== null) return;
  const loop = () => {
    if (!isMatchInProgress) {
      drawBracketUI();
    }
    bracketLoopId = requestAnimationFrame(loop);
  };
  loop();
}

function stopBracketLoop() {
  if (bracketLoopId !== null) {
    cancelAnimationFrame(bracketLoopId);
    bracketLoopId = null;
  }
}

export async function startTournament(
  canvas: HTMLCanvasElement,
  scene: Scene,
  players: string[],
  onEndCallback?: () => void,
  onReturnToMenu?: () => void
) {
  canvasElement = canvas;
  tm = new TournamentManager(players);
  onTournamentEnd = onEndCallback || null;
  isMatchInProgress = false;
  tournamentEnded = false;

  uiFactory = new UIFactory(canvas, scene, "TournamentUI");
  
  uiFactory.createBackground();
  uiFactory.createBorder();
	uiFactory.createTitle("Tournament Bracket", Math.floor(canvas.height * 0.07));
  bracketUI = new TournamentBracketUI(canvas, scene);

  drawBracketUI();

  nextMatchButton = uiFactory.createButton({
    text: 'Start Match',
    top: '72%',
    onClick: () => { if (!isMatchInProgress && !tournamentEnded) startNextMatch(scene); },
    hoverColor: '#55CFD4'
  });

  endTournamentButton = uiFactory.createButton({
    text: 'End Tournament',
    top: '82%',
    onClick: () => { endTournament(); if (onReturnToMenu) onReturnToMenu(); },
    hoverColor: '#0489C2'
  });

  updateButtonVisibility();
  startBracketLoop();
}

function drawBracketUI() {
  const matches = tm.currentRound.map(match => ({
    player1: match.player1,
    player2: match.player2,
    winner: match.winner
  }));

  const isFinished = tm.isFinished();
  const champion = isFinished ? tm.getChampion() : undefined;

  if (isFinished) {
    tournamentEnded = true;
  }

  bracketUI.updateBracket(matches, isFinished, champion);
  updateButtonVisibility();
}

function updateButtonVisibility() {
  if (nextMatchButton) {
    nextMatchButton.isVisible = !tm.isFinished() && tm.hasNextMatch();
  }
  if (endTournamentButton) {
    endTournamentButton.isVisible = tm.isFinished();
  }
}

function startNextMatch(scene: Scene) {
  const match = tm.getNextMatch();
  if (!match || !match.player1 || !match.player2) return;
  isMatchInProgress = true;
  stopBracketLoop();
  hideTournamentUI();
  startPongMatch(canvasElement, scene, false, match.player1, match.player2, (winner, leftScore, rightScore) => {
    tm.recordWinner(winner, leftScore, rightScore);
    isMatchInProgress = false;
    showTournamentUI();
    startBracketLoop();
  });
}

function endTournament() {
  cleanupTournament();
  if (onTournamentEnd) onTournamentEnd();
}

export function cleanupTournament() {
  stopBracketLoop();
  
  if (uiFactory) {
    uiFactory.dispose();
    uiFactory = null as any;
  }
  
  if (bracketUI) {
    bracketUI.dispose();
    bracketUI = null as any;
  }
  
  nextMatchButton = null;
  endTournamentButton = null;
  tm = null as any;
}
