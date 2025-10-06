import * as GUI from '@babylonjs/gui';
import { Scene } from '@babylonjs/core';

export class PongScoreUI {
  private ui: GUI.AdvancedDynamicTexture;
  private player1ScoreText: GUI.TextBlock;
  private player2ScoreText: GUI.TextBlock;
  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement, scene: Scene) {
    this.canvas = canvas;
    this.ui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("ScoreUI", true, scene);
    this.createScoreElements();
  }

  private createScoreElements(): void {
    // Player 1 Score
    this.player1ScoreText = new GUI.TextBlock();
    this.player1ScoreText.text = "0";
    this.player1ScoreText.color = "white";
    this.player1ScoreText.fontSize = Math.floor(this.canvas.height * 0.15);
    this.player1ScoreText.fontWeight = "bold";
    this.player1ScoreText.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    this.player1ScoreText.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    this.player1ScoreText.top = "5%";
    this.player1ScoreText.left = "10%";
    this.ui.addControl(this.player1ScoreText);

    // Player 2 Score
    this.player2ScoreText = new GUI.TextBlock();
    this.player2ScoreText.text = "0";
    this.player2ScoreText.color = "white";
    this.player2ScoreText.fontSize = Math.floor(this.canvas.height * 0.15);
    this.player2ScoreText.fontWeight = "bold";
    this.player2ScoreText.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    this.player2ScoreText.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    this.player2ScoreText.top = "5%";
    this.player2ScoreText.left = "-10%";
    this.ui.addControl(this.player2ScoreText);
  }

  public updateScores(leftScore: number, rightScore: number): void {
    this.player1ScoreText.text = leftScore.toString();
    this.player2ScoreText.text = rightScore.toString();
  }

  public getUI(): GUI.AdvancedDynamicTexture {
    return this.ui;
  }

  public dispose(): void {
    this.ui.dispose();
  }
}