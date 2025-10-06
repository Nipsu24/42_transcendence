import * as GUI from '@babylonjs/gui';
import { Scene } from '@babylonjs/core';

export interface ButtonConfig {
  text: string;
  width?: string;
  height?: string;
  top?: string;
  left?: string;
  fontSize?: number;
  color?: string;
  background?: string;
  hoverColor?: string;
  hoverTextColor?: string;
  cornerRadius?: number;
  thickness?: number;
  fontWeight?: string;
  onClick?: () => void;
}

export interface TextBlockConfig {
  text: string;
  fontSize?: number;
  color?: string;
  fontFamily?: string;
  fontWeight?: string;
  top?: string;
  left?: string;
  horizontalAlignment?: number;
  verticalAlignment?: number;
  alpha?: number;
}

export interface BackgroundConfig {
  width?: string;
  height?: string;
  color?: string;
  background?: string;
  alpha?: number;
  thickness?: number;
  cornerRadius?: number;
}

export class UIFactory {
  private ui: GUI.AdvancedDynamicTexture;
  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement, scene?: Scene, name: string = "UI") {
    this.canvas = canvas;
    this.ui = scene 
      ? GUI.AdvancedDynamicTexture.CreateFullscreenUI(name, true, scene)
      : GUI.AdvancedDynamicTexture.CreateFullscreenUI(name);
  }

  public createBackground(config: BackgroundConfig = {}): GUI.Rectangle {
    const background = new GUI.Rectangle();
    background.width = config.width || "100%";
    background.height = config.height || "100%";
    background.color = config.color || "transparent";
    background.thickness = config.thickness || 0;
    background.background = config.background || "rgba(0, 0, 0, 0.85)";
    background.alpha = config.alpha || 1.0;
    
    if (config.cornerRadius !== undefined) {
      background.cornerRadius = config.cornerRadius;
    }
    
    this.ui.addControl(background);
    return background;
  }

  public createBorder(config: BackgroundConfig = {}): GUI.Rectangle {
    const border = new GUI.Rectangle();
    border.width = config.width || "95%";
    border.height = config.height || "90%";
    border.color = config.color || "white";
    border.thickness = config.thickness || 3;
    border.background = config.background || "transparent";
    border.alpha = config.alpha || 1.0;
    border.cornerRadius = config.cornerRadius || 10;
    
    this.ui.addControl(border);
    return border;
  }

  public createTextBlock(config: TextBlockConfig): GUI.TextBlock {
    const textBlock = new GUI.TextBlock();
    textBlock.text = config.text;
    textBlock.color = config.color || "white";
    textBlock.fontSize = config.fontSize || Math.floor(this.canvas.height * 0.04);
    textBlock.fontFamily = config.fontFamily || "futura-pt, sans-serif";
    
    if (config.fontWeight) {
      textBlock.fontWeight = config.fontWeight;
    }
    
    if (config.horizontalAlignment !== undefined) {
      textBlock.textHorizontalAlignment = config.horizontalAlignment;
    }
    
    if (config.verticalAlignment !== undefined) {
      textBlock.textVerticalAlignment = config.verticalAlignment;
    }
    
    if (config.top) {
      textBlock.top = config.top;
    }
    
    if (config.left) {
      textBlock.left = config.left;
    }
    
    textBlock.alpha = config.alpha || 1.0;
    
    this.ui.addControl(textBlock);
    return textBlock;
  }

  public createButton(config: ButtonConfig): GUI.Button {
    const button = GUI.Button.CreateSimpleButton(`btn_${config.text}`, config.text);
    
    button.width = config.width || "30%";
    button.height = config.height || "8%";
    button.color = config.color || "white";
    button.background = config.background || "rgba(51, 51, 51, 0.9)";
    button.cornerRadius = config.cornerRadius || 0;
    button.thickness = config.thickness || 3;
    button.fontSize = config.fontSize || Math.floor(this.canvas.height * 0.035);
    button.fontWeight = config.fontWeight || "bold";
    button.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    button.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    
    if (config.top) {
      button.top = config.top;
    }
    
    if (config.left) {
      button.left = config.left;
    }

    // Add hover effects
    const originalBackground = button.background;
    const originalColor = button.color;
    const hoverColor = config.hoverColor || "#FE8915";
    const hoverTextColor = config.hoverTextColor || "black";

    button.onPointerEnterObservable.add(() => {
      button.background = hoverColor;
      button.color = hoverTextColor;
      button.scaleX = 1.05;
      button.scaleY = 1.05;
    });

    button.onPointerOutObservable.add(() => {
      button.background = originalBackground;
      button.color = originalColor;
      button.scaleX = 1.0;
      button.scaleY = 1.0;
    });

    if (config.onClick) {
      button.onPointerClickObservable.add(() => config.onClick!());
    }

    this.ui.addControl(button);
    return button;
  }

  public createTitle(text: string, fontSize?: number): GUI.TextBlock {
    return this.createTextBlock({
      text,
      fontSize: fontSize || Math.floor(this.canvas.height * 0.08),
      fontWeight: "bold",
      horizontalAlignment: GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,
      verticalAlignment: GUI.Control.VERTICAL_ALIGNMENT_TOP,
      top: "15%"
    });
  }

  public createWelcomeText(playerName: string): GUI.TextBlock {
    return this.createTextBlock({
      text: `Welcome, ${playerName}`,
      color: "#cccccc",
      fontSize: Math.floor(this.canvas.height * 0.04),
      horizontalAlignment: GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,
      verticalAlignment: GUI.Control.VERTICAL_ALIGNMENT_TOP,
      top: "25%"
    });
  }

  public getUI(): GUI.AdvancedDynamicTexture {
    return this.ui;
  }

  public dispose(): void {
    this.ui.dispose();
  }
}