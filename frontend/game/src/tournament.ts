import { startPongMatch } from './3dPong';
import { TournamentManager } from './TournamentManager.js';
import { AdvancedDynamicTexture, Button as GUIButton, TextBlock } from '@babylonjs/gui';
import * as GUI from "@babylonjs/gui";
import { Engine, Scene } from '@babylonjs/core';

let tm: TournamentManager;
let onTournamentEnd: (() => void) | null = null;
let isMatchInProgress = false;
let tournamentEnded = false;

let canvasElement: HTMLCanvasElement;
let ui: AdvancedDynamicTexture;
let nextMatchButton: GUIButton;
let endTournamentButton: GUIButton;
let playerTextBlocks: TextBlock[] = [];

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

  // Create UI
  ui = AdvancedDynamicTexture.CreateFullscreenUI("TournamentUI", true, scene);
  
  // Add border rectangle
  const border = new GUI.Rectangle();
  border.widthInPixels = canvas.width * 0.98;
  border.heightInPixels = canvas.height * 0.98;
  border.thickness = 4;
  border.color = "white";
  border.background = "transparent";
  ui.addControl(border);
  
  const panel = new GUI.StackPanel();
  panel.width = "100%";
  panel.top = "10%";
  panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  ui.addControl(panel);

  // Title
  const title = new TextBlock();
  title.text = "Tournament Bracket";
  title.color = "white";
  title.fontSize = 50;
  panel.addControl(title);

  drawBracketUI();

  // Create buttons
  nextMatchButton = GUIButton.CreateSimpleButton("nextMatch", "Start Match");
  nextMatchButton.width = "250px";
  nextMatchButton.height = "60px";
  nextMatchButton.color = "white";
  nextMatchButton.background = "green";
  nextMatchButton.onPointerUpObservable.add(() => {
    if (!isMatchInProgress && !tournamentEnded) startNextMatch(scene);
  });

  endTournamentButton = GUIButton.CreateSimpleButton("endTournament", "End Tournament");
  endTournamentButton.width = "250px";
  endTournamentButton.height = "60px";
  endTournamentButton.color = "white";
  endTournamentButton.background = "red";
  endTournamentButton.isVisible = false;
  endTournamentButton.onPointerUpObservable.add(() => {
    endTournament();
    if (onReturnToMenu) onReturnToMenu();
  });

  panel.addControl(nextMatchButton);
  panel.addControl(endTournamentButton);

  scene.onBeforeRenderObservable.add(updateUI);
}

function drawBracketUI() {
  playerTextBlocks.forEach(tb => tb.dispose());
  playerTextBlocks = [];

  const matches = tm.currentRound;
  matches.forEach((match, i) => {
    const tb1 = new TextBlock();
    tb1.text = match.player1;
    tb1.color = match.winner === match.player1 ? "lightgreen" : "white";
    tb1.fontSize = 30;
    tb1.top = `${150 + i * 50}px`;
    tb1.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    tb1.paddingLeft = "50px";
    ui.addControl(tb1);
    playerTextBlocks.push(tb1);

    const tb2 = new TextBlock();
    tb2.text = match.player2 || "(bye)";
    tb2.color = match.winner === match.player2 ? "lightgreen" : "white";
    tb2.fontSize = 30;
    tb2.top = `${150 + i * 50}px`;
    tb2.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    tb2.paddingRight = "50px";
    ui.addControl(tb2);
    playerTextBlocks.push(tb2);
  });

  // Show champion announcement when tournament is finished
  if (tm.isFinished()) {
    tournamentEnded = true;
    
    // Create champion announcement
    const championText = new TextBlock();
    championText.text = `🏆 Champion: ${tm.getChampion()}`;
    championText.color = "gold";
    championText.fontSize = 60;
    championText.top = "40%";
    championText.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    ui.addControl(championText);
    playerTextBlocks.push(championText);
  }

  nextMatchButton.isVisible = !tm.isFinished() && tm.hasNextMatch();
  endTournamentButton.isVisible = tm.isFinished();
}

function updateUI() {
  drawBracketUI();
}

function startNextMatch(scene: Scene) {
  const match = tm.getNextMatch();
  if (!match || !match.player1 || !match.player2) {
    return;
  }

  isMatchInProgress = true;

  startPongMatch(canvasElement, scene, false, match.player1, match.player2, (winner, leftScore, rightScore) => {
    tm.recordWinner(winner, leftScore, rightScore);
    isMatchInProgress = false;
    updateUI();
  });
}

function endTournament() {
  cleanupTournament();
  
  if (onTournamentEnd) {
    onTournamentEnd();
  }
}

export function cleanupTournament() {
  if (ui) {
    ui.dispose();
    ui = null;
  }
  playerTextBlocks.forEach(tb => tb.dispose());
  playerTextBlocks = [];
  nextMatchButton = null;
  endTournamentButton = null;
  tm = null;
}
