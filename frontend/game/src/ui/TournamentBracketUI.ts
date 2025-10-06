import * as GUI from '@babylonjs/gui';
import { Scene } from '@babylonjs/core';

export interface Match {
  player1: string;
  player2: string | null;
  winner?: string;
}

export class TournamentBracketUI {
  private ui: GUI.AdvancedDynamicTexture;
  private canvas: HTMLCanvasElement;
  private playerTextBlocks: GUI.TextBlock[] = [];
  private championText: GUI.TextBlock | null = null;

  constructor(canvas: HTMLCanvasElement, scene: Scene) {
    this.canvas = canvas;
    this.ui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("TournamentBracketUI", true, scene);
  }

  public updateBracket(matches: Match[], isFinished: boolean, champion?: string): void {
    // Clear existing text blocks
    this.clearBracket();

    const count = matches.length;
    const topStart = count <= 4 ? 18 : 14;
    const bottomLimit = 58;
    const available = Math.max(4, bottomLimit - topStart);
    const spacing = count > 1 ? available / (count - 1) : 0;

    const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
    const baseH = this.canvas.height;
    const nameFont = clamp(Math.floor(baseH * 0.032), 18, 42);
    const vsFont = clamp(Math.floor(baseH * 0.022), 12, 28);
    const champFont = clamp(Math.floor(baseH * 0.055), 28, 72);

    // Create match displays
    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      const yPos = `${topStart + i * spacing}%`;

      // Player 1
      const tb1 = new GUI.TextBlock();
      tb1.text = match.player1;
      tb1.color = match.winner === match.player1 ? 'lightgreen' : 'white';
      tb1.fontSize = nameFont;
      tb1.fontFamily = 'futura-pt, sans-serif';
      tb1.width = '40%';
      tb1.isPointerBlocker = false;
      tb1.zIndex = 10;
      tb1.top = yPos;
      tb1.left = '10%';
      tb1.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
      tb1.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
      this.ui.addControl(tb1);
      this.playerTextBlocks.push(tb1);

      // VS text
      const vsText = new GUI.TextBlock();
      vsText.text = 'VS';
      vsText.color = 'white';
      vsText.fontSize = vsFont;
      vsText.fontFamily = 'futura-pt, sans-serif';
      vsText.width = '10%';
      vsText.isPointerBlocker = false;
      vsText.zIndex = 10;
      vsText.top = yPos;
      vsText.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
      vsText.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
      this.ui.addControl(vsText);
      this.playerTextBlocks.push(vsText);

      // Player 2
      const tb2 = new GUI.TextBlock();
      tb2.text = match.player2 || '(bye)';
      tb2.color = match.winner === match.player2 ? 'lightgreen' : 'white';
      tb2.fontSize = nameFont;
      tb2.fontFamily = 'futura-pt, sans-serif';
      tb2.width = '40%';
      tb2.isPointerBlocker = false;
      tb2.zIndex = 10;
      tb2.top = yPos;
      tb2.left = '-10%';
      tb2.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
      tb2.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
      this.ui.addControl(tb2);
      this.playerTextBlocks.push(tb2);
    }

    // Show champion if tournament is finished
    if (isFinished && champion) {
      this.championText = new GUI.TextBlock();
      this.championText.text = `🏆 Champion: ${champion}`;
      this.championText.color = 'gold';
      this.championText.fontSize = champFont;
      this.championText.fontWeight = 'bold';
      this.championText.fontFamily = 'futura-pt, sans-serif';
      this.championText.top = '0px';
      this.championText.isPointerBlocker = false;
      this.championText.zIndex = 12;
      this.championText.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
      this.championText.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
      this.ui.addControl(this.championText);
      this.playerTextBlocks.push(this.championText);
    }
  }

  public clearBracket(): void {
    this.playerTextBlocks.forEach(block => block.dispose());
    this.playerTextBlocks = [];
    
    if (this.championText) {
      this.championText.dispose();
      this.championText = null;
    }
  }

  public show(): void {
    this.ui.rootContainer.isVisible = true;
    this.ui.rootContainer.isHitTestVisible = true;
  }

  public hide(): void {
    this.ui.rootContainer.isVisible = false;
    this.ui.rootContainer.isHitTestVisible = false;
  }

  public getUI(): GUI.AdvancedDynamicTexture {
    return this.ui;
  }

  public dispose(): void {
    this.clearBracket();
    this.ui.dispose();
  }
}