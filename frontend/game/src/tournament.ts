import { startPongMatch } from './3dPong';
import { TournamentManager } from './TournamentManager.js';
import { AdvancedDynamicTexture, TextBlock } from '@babylonjs/gui';
import * as GUI from "@babylonjs/gui";
import { Scene } from '@babylonjs/core';

let tm: TournamentManager;
let onTournamentEnd: (() => void) | null = null;
let isMatchInProgress = false;
let tournamentEnded = false;

let canvasElement: HTMLCanvasElement;
let ui: AdvancedDynamicTexture;
let nextMatchButton: GUI.Button;
let endTournamentButton: GUI.Button;
let playerTextBlocks: TextBlock[] = [];
let buttonsRef: GUI.Button[] = [];
let bracketLoopId: number | null = null; // NEW

function hideTournamentUI() {
  if (ui) {
    
    ui.rootContainer.isVisible = false;
    
    ui.rootContainer.isHitTestVisible = false;
  }
}

function showTournamentUI() {
  if (ui) {
    
    ui.rootContainer.isVisible = true;
    
    ui.rootContainer.isHitTestVisible = true;
  }
}

function startBracketLoop() {
  if (bracketLoopId !== null) return;
  const loop = () => {
    if (!isMatchInProgress) {
      drawBracketUI(); // mirror 2D logic: re-render each frame
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

  ui = AdvancedDynamicTexture.CreateFullscreenUI("TournamentUI", true, scene);
  
  const background = new GUI.Rectangle();
  background.width = "100%";
  background.height = "100%";
  background.color = "transparent";
  background.thickness = 0;
  background.background = "rgba(0, 0, 0, 0.85)";
  ui.addControl(background);
  
  const border = new GUI.Rectangle();
  border.width = "95%";
  border.height = "90%";
  border.thickness = 4;
  border.color = "white";
  border.background = "transparent";
  border.cornerRadius = 10;
  border.isPointerBlocker = false; // allow clicks to reach buttons
  ui.addControl(border);

  const title = new TextBlock();
  title.text = "Tournament Bracket";
  title.color = "white";
  title.fontSize = Math.floor(canvas.height * 0.07);
  title.fontWeight = "bold";
  title.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  title.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
  title.top = "15%";
  title.isPointerBlocker = false;
  ui.addControl(title);

  // Initial draw
  drawBracketUI();

  const buttons: GUI.Button[] = [];
  buttonsRef = buttons;
  const buttonConfigs: Array<{
    id: string; text: string; topPercent: number; hoverColor: string; onClick: () => void; visible: () => boolean;
  }> = [
    {
      id: 'nextMatch', text: 'Start Match', topPercent: 72, hoverColor: '#55CFD4',
      onClick: () => { if (!isMatchInProgress && !tournamentEnded) startNextMatch(scene); },
      visible: () => tm.hasNextMatch() && !tm.isFinished()
    },
    {
      id: 'endTournament', text: 'End Tournament', topPercent: 82, hoverColor: '#0489C2',
      onClick: () => { endTournament(); if (onReturnToMenu) onReturnToMenu(); },
      visible: () => tm.isFinished()
    }
  ];

  buttonConfigs.forEach(cfg => {
    const btn = GUI.Button.CreateSimpleButton(cfg.id, cfg.text);
    btn.width = '30%';
    btn.height = '8%';
    btn.color = 'white';
    btn.background = 'rgba(51, 51, 51, 0.9)';
    btn.cornerRadius = 0;
    btn.thickness = 3;
    btn.fontSize = Math.floor(canvas.height * 0.035);
    btn.fontWeight = 'bold';
    btn.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    btn.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    btn.top = `${cfg.topPercent}%`;
    btn.zIndex = 50;

    btn.onPointerEnterObservable.add(() => {
      btn.background = cfg.hoverColor;
      btn.color = 'black';
      btn.scaleX = 1.05;
      btn.scaleY = 1.05;
    });
    btn.onPointerOutObservable.add(() => {
      btn.background = 'rgba(51, 51, 51, 0.9)';
      btn.color = 'white';
      btn.scaleX = 1.0;
      btn.scaleY = 1.0;
    });

    btn.onPointerClickObservable.add(cfg.onClick);

    ui.addControl(btn);
    buttons.push(btn);
    if (cfg.id === 'nextMatch') nextMatchButton = btn;
    if (cfg.id === 'endTournament') endTournamentButton = btn;
  });

  // Initial visibility
  for (let i = 0; i < buttons.length; i++) {
    const b = buttons[i];
    for (let j = 0; j < buttonConfigs.length; j++) {
      if (buttonConfigs[j].id === b.name) {
        b.isVisible = buttonConfigs[j].visible();
        break;
      }
    }
  }

  // Start bracket UI loop (replaces canvas animation loop)
  startBracketLoop();
}

function drawBracketUI() {
  // Clear previous dynamic text controls
  for (let i = 0; i < playerTextBlocks.length; i++) playerTextBlocks[i].dispose();
  playerTextBlocks = [];

  const matches = tm.currentRound;
  const count = matches.length;

  // Dynamic vertical layout so items don't drift too low
  const topStart = count <= 4 ? 18 : 14;          // starting percentage from top
  const bottomLimit = 58;                         // keep bracket within upper 60%
  const available = Math.max(4, bottomLimit - topStart);
  const spacing = count > 1 ? available / (count - 1) : 0;

  // Helper for clamped font sizing
  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
  const baseH = canvasElement.height;
  const nameFont = clamp(Math.floor(baseH * 0.032), 18, 42);
  const vsFont = clamp(Math.floor(baseH * 0.022), 12, 28);
  const champFont = clamp(Math.floor(baseH * 0.055), 28, 72);

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const yPos = `${topStart + i * spacing}%`;

    const tb1 = new TextBlock();
    tb1.text = match.player1;
    tb1.color = match.winner === match.player1 ? 'lightgreen' : 'white';
    tb1.fontSize = nameFont;
    tb1.fontFamily = 'futura-pt, sans-serif';
    tb1.width = '40%'; tb1.isPointerBlocker = false; tb1.zIndex = 10; tb1.top = yPos; tb1.left = '10%';
    tb1.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    tb1.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    ui.addControl(tb1); playerTextBlocks.push(tb1);

    const vsText = new TextBlock();
    vsText.text = 'VS'; vsText.color = 'white'; vsText.fontSize = vsFont; vsText.fontFamily = 'futura-pt, sans-serif';
    vsText.width = '10%'; vsText.isPointerBlocker = false; vsText.zIndex = 10; vsText.top = yPos;
    vsText.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    vsText.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    ui.addControl(vsText); playerTextBlocks.push(vsText);

    const tb2 = new TextBlock();
    tb2.text = match.player2 || '(bye)';
    tb2.color = match.winner === match.player2 ? 'lightgreen' : 'white';
    tb2.fontSize = nameFont; tb2.fontFamily = 'futura-pt, sans-serif'; tb2.width = '40%'; tb2.isPointerBlocker = false;
    tb2.zIndex = 10; tb2.top = yPos; tb2.left = '-10%';
    tb2.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    tb2.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    ui.addControl(tb2); playerTextBlocks.push(tb2);
  }

  if (tm.isFinished()) {
    tournamentEnded = true;
    const championText = new TextBlock();
    championText.text = `🏆 Champion: ${tm.getChampion()}`;
    championText.color = 'gold';
    championText.fontSize = champFont;
    championText.fontWeight = 'bold';
    championText.fontFamily = 'futura-pt, sans-serif';
    championText.top = '33%';
    championText.isPointerBlocker = false;
    championText.zIndex = 12;
    championText.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    championText.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    ui.addControl(championText);
    playerTextBlocks.push(championText);
  }

  if (nextMatchButton) nextMatchButton.isVisible = !tm.isFinished() && tm.hasNextMatch();
  if (endTournamentButton) endTournamentButton.isVisible = tm.isFinished();
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
  if (ui) {
    
    ui.rootContainer.isVisible = false;
    ui.dispose();
    ui = null;
  }
  for (let i = 0; i < playerTextBlocks.length; i++) playerTextBlocks[i].dispose();
  playerTextBlocks = [];
  if (nextMatchButton) nextMatchButton.dispose();
  if (endTournamentButton) endTournamentButton.dispose();
  for (let i = 0; i < buttonsRef.length; i++) if (buttonsRef[i]) buttonsRef[i].dispose();
  buttonsRef = [];
  tm = null;
}
