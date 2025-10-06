import * as GUI from '@babylonjs/gui';
import { Scene } from '@babylonjs/core';

export class PlayerListUI {
  private ui: GUI.AdvancedDynamicTexture;
  private playerListText: GUI.TextBlock;
  private canvas: HTMLCanvasElement;
  private players: string[];

  constructor(canvas: HTMLCanvasElement, scene: Scene, initialPlayers: string[] = []) {
    this.canvas = canvas;
    this.players = [...initialPlayers];
    this.ui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("PlayerListUI", true, scene);
    this.createPlayerList();
  }

  private createPlayerList(): void {
    this.playerListText = new GUI.TextBlock();
    this.playerListText.text = this.players.join("\n");
    this.playerListText.color = "white";
    this.playerListText.fontSize = Math.floor(this.canvas.height * 0.04);
    this.playerListText.fontFamily = "futura-pt, sans-serif";
    this.playerListText.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    this.playerListText.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    this.playerListText.top = "25%";
    this.playerListText.left = "20%";
    this.playerListText.alpha = 1.0;
    this.ui.addControl(this.playerListText);
  }

  public addPlayer(playerName: string): void {
    let playerExists = false;
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i] === playerName) {
        playerExists = true;
        break;
      }
    }
    
    if (!playerExists) {
      this.players.push(playerName);
      this.updateDisplay();
    }
  }

  public removeLastPlayer(): string | null {
    if (this.players.length > 1) {
      const removed = this.players.pop();
      this.updateDisplay();
      return removed || null;
    }
    return null;
  }

  public getPlayers(): string[] {
    return [...this.players];
  }

  public getPlayerCount(): number {
    return this.players.length;
  }

  private updateDisplay(): void {
    this.playerListText.text = this.players.join("\n");
  }

  public dispose(): void {
    this.ui.dispose();
  }
}