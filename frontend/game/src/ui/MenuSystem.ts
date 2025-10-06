import { Scene } from '@babylonjs/core';
import { UIFactory, ButtonConfig } from './UIFactory';

export interface MenuConfig {
  title: string;
  welcomeText?: string;
  buttons: MenuButtonConfig[];
  showBorder?: boolean;
  showBackground?: boolean;
}

export interface MenuButtonConfig extends ButtonConfig {
  id: string;
}

export class MenuSystem {
  private canvas: HTMLCanvasElement;
  private scene: Scene;
  private uiFactory: UIFactory;
  private buttons: any[] = [];
  private onQuit?: () => void;

  constructor(canvas: HTMLCanvasElement, scene: Scene, onQuit?: () => void) {
    this.canvas = canvas;
    this.scene = scene;
    this.onQuit = onQuit;
    this.uiFactory = new UIFactory(canvas, scene, "MenuUI");
  }

  public createMenu(config: MenuConfig): () => void {
    // Create background if requested
    if (config.showBackground !== false) {
      this.uiFactory.createBackground();
    }

    // Create border if requested
    if (config.showBorder !== false) {
      this.uiFactory.createBorder();
    }

    // Create title
    this.uiFactory.createTitle(config.title);

    // Create welcome text if provided
    if (config.welcomeText) {
      this.uiFactory.createWelcomeText(config.welcomeText);
    }

    // Create buttons
    this.createButtons(config.buttons);

    // Return cleanup function
    return () => this.cleanup();
  }

  private createButtons(buttonConfigs: MenuButtonConfig[]): void {
    const startY = 0.35;
    const spacing = 0.15;

    buttonConfigs.forEach((config, index) => {
      const buttonConfig: ButtonConfig = {
        ...config,
        top: `${(startY + spacing * index) * 100}%`
      };

      const button = this.uiFactory.createButton(buttonConfig);
      this.buttons.push(button);
    });
  }

  public createDefaultGameMenu(playerName: string, callbacks: {
    onSinglePlayer: () => void;
    onTwoPlayers: () => void;
    onTournament: () => void;
    onQuit?: () => void;
  }): () => void {
    const menuConfig: MenuConfig = {
      title: "PONG",
      welcomeText: playerName,
      buttons: [
        {
          id: "singlePlayer",
          text: "1 Player",
          onClick: callbacks.onSinglePlayer,
          hoverColor: "#FE8915"
        },
        {
          id: "twoPlayers",
          text: "2 Players",
          onClick: callbacks.onTwoPlayers,
          hoverColor: "#FF4F1A"
        },
        {
          id: "tournament",
          text: "Tournament",
          onClick: callbacks.onTournament,
          hoverColor: "#55CFD4"
        },
        {
          id: "quit",
          text: "Quit",
          onClick: callbacks.onQuit || this.defaultQuitHandler.bind(this),
          hoverColor: "#0489C2"
        }
      ]
    };

    return this.createMenu(menuConfig);
  }

  public createTournamentMenu(callbacks: {
    onAddPlayer: () => void;
    onRemovePlayer: () => void;
    onStartTournament: () => void;
    onBack: () => void;
  }): () => void {
    const menuConfig: MenuConfig = {
      title: "Tournament Setup",
      buttons: [
        {
          id: "addPlayer",
          text: "Add Player",
          onClick: callbacks.onAddPlayer,
          hoverColor: "#55CFD4"
        },
        {
          id: "removePlayer",
          text: "Remove Player",
          onClick: callbacks.onRemovePlayer,
          hoverColor: "#FF4F1A"
        },
        {
          id: "startTournament",
          text: "Start Tournament",
          onClick: callbacks.onStartTournament,
          hoverColor: "#FE8915"
        },
        {
          id: "back",
          text: "Back",
          onClick: callbacks.onBack,
          hoverColor: "#0489C2"
        }
      ]
    };

    return this.createMenu(menuConfig);
  }

  private defaultQuitHandler(): void {
    if (this.onQuit) {
      this.onQuit();
    } else {
      window.location.href = '/gamemenu';
    }
  }

  private cleanup(): void {
    this.buttons.forEach(button => button.dispose());
    this.buttons = [];
    this.uiFactory.dispose();
  }

  public dispose(): void {
    this.cleanup();
  }
}