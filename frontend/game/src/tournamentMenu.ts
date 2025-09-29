import { Scene } from '@babylonjs/core';
import * as GUI from "@babylonjs/gui";
import { startTournament, cleanupTournament } from './tournament.js';
import { startMenu } from './menu.js';
import { getMe } from '../../src/services/players.js';

const MIN_PLAYERS = 3;
const MAX_PLAYERS = 16;

let me: any;

export async function startTournamentMenu(
  canvas: HTMLCanvasElement,
  scene: Scene,
  onQuit?: () => void
) {
  console.log("Starting tournament menu...");
  
  try {
    console.log("Creating UI...");
    const ui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("TournamentMenuUI", true, scene);

    console.log("Fetching user data...");
    try {
      me = await getMe();
    } catch (apiError) {
      console.error("API call to getMe() failed:", apiError);
      console.error("API error details:", apiError instanceof Error ? apiError.message : 'Unknown API error');
      
      alert("Failed to load user data from server. Please check your connection and try again.");
      startMenu(canvas, scene, onQuit);
      return;
    }
    
    if (!me) {
      console.error("Failed to get user data - me is null/undefined after API call");
      alert("Failed to load user data - server returned empty response");
      startMenu(canvas, scene, onQuit);
      return;
    }

    console.log("User data loaded:", me.name);
    const players: string[] = [me.name];

    console.log("Creating background UI elements...");
    
    const background = new GUI.Rectangle();
    background.width = "100%";
    background.height = "100%";
    background.color = "transparent";
    background.thickness = 0;
    background.background = "rgba(0, 0, 0, 0.85)";
    background.alpha = 1.0;
    ui.addControl(background);

    const border = new GUI.Rectangle();
    border.width = "95%";
    border.height = "90%";
    border.color = "white";
    border.thickness = 3;
    border.background = "transparent";
    border.alpha = 1.0;
    border.cornerRadius = 10;
    ui.addControl(border);

    const title = new GUI.TextBlock();
    title.text = "Tournament Setup";
    title.color = "white";
    title.fontSize = Math.floor(canvas.height * 0.07);
    title.fontWeight = "bold";
    title.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    title.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    title.top = "15%";
    title.alpha = 1.0;
    ui.addControl(title);

    const playerList = new GUI.TextBlock();
    playerList.color = "white";
    playerList.fontSize = Math.floor(canvas.height * 0.04);
    playerList.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    playerList.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    playerList.top = "25%";
    playerList.left = "20%";
    playerList.alpha = 1.0;
    ui.addControl(playerList);

    const updatePlayerList = () => {
      playerList.text = players.join("\n");
    };

    updatePlayerList();

    let y = 0.35;
    const space = 0.15;

    const buttonWidth = "30%";
    const buttonHeight = "8%";

    const buttons: GUI.Button[] = [];

    const cleanup = () => {
      buttons.forEach(btn => btn.dispose());
      ui.dispose();
      cleanupTournament();
    };

    // Button handlers
    const handleAddFriend = () => {
      if (players.length >= MAX_PLAYERS) {
        alert(`Maximum of ${MAX_PLAYERS} players reached.`);
        return;
      }
      if (!me.friends || me.friends.length === 0) {
        alert("You have no friends to add. Add some first!");
        return;
      }

      const friendNames = me.friends.map(f => f.name).join(", ");
      const chosen = prompt(`Choose a friend to add: ${friendNames}`);

      const friend = me.friends.find(f => f.name === chosen);
      if (!friend) {
        alert("Invalid selection.");
        return;
      }
      if (players.includes(friend.name)) {
        alert(`${friend.name} is already in the tournament.`);
        return;
      }

      players.push(friend.name);
      updatePlayerList();
    };

    const handleRemoveLast = () => {
      if (players.length <= 1) {
        alert("You cannot remove yourself from the tournament.");
        return;
      }
      players.pop();
      updatePlayerList();
    };

    const handleStartTournament = () => {
      if (players.length < MIN_PLAYERS) {
        alert(`At least ${MIN_PLAYERS} players required!`);
        return;
      }
      cleanup();
      startTournament(canvas, scene, players, () => {
        startMenu(canvas, scene, onQuit);
      });
    };

    const handleBack = () => {
      cleanup();
      startMenu(canvas, scene, onQuit);
    };

    // Config array with actions (same structure as babylonMenu)
    const buttonConfigs = [
      { text: "Add Friend", top: `${y * 100}%`, onClick: handleAddFriend },
      { text: "Remove Last", top: `${(y + space) * 100}%`, onClick: handleRemoveLast },
      { text: "Start Tournament", top: `${(y + space * 2) * 100}%`, onClick: handleStartTournament },
      { text: "Back", top: `${(y + space * 3) * 100}%`, onClick: handleBack },
    ];

    // Create Babylon.js GUI buttons (same structure as babylonMenu)
    buttonConfigs.forEach(cfg => {
      const button = GUI.Button.CreateSimpleButton(`btn_${cfg.text}`, cfg.text);
      button.width = buttonWidth;
      button.height = buttonHeight;
      button.color = "white";
      button.background = "rgba(51, 51, 51, 0.9)";
      button.cornerRadius = 8;
      button.thickness = 3;
      button.fontSize = Math.floor(canvas.height * 0.035);
      button.fontWeight = "bold";
      button.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
      button.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
      button.top = cfg.top;

      // Hover effects (same as babylonMenu)
      button.onPointerEnterObservable.add(() => {
        button.background = "rgba(31, 156, 96, 0.95)";
        button.color = "black";
        button.scaleX = 1.05;
        button.scaleY = 1.05;
      });
      button.onPointerOutObservable.add(() => {
        button.background = "rgba(51, 51, 51, 0.9)";
        button.color = "white";
        button.scaleX = 1.0;
        button.scaleY = 1.0;
      });

      // Click action
      button.onPointerClickObservable.add(() => cfg.onClick());

      ui.addControl(button);
      buttons.push(button);
    });

    console.log(`Total buttons created: ${buttons.length}`);
    console.log("UI controls count:", ui.getChildren().length);

    // Return cleanup function so it can be called from outside
    return cleanup;

  } catch (error) {
    console.error("Error in tournament menu:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : 'No stack trace');
    console.error("Canvas:", canvas);
    console.error("Scene:", scene);
    alert("Error loading tournament menu: " + (error instanceof Error ? error.message : 'Unknown error'));
    
    // Try to fallback to main menu even if there's an error
    try {
      startMenu(canvas, scene, onQuit);
    } catch (fallbackError) {
      console.error("Fallback to main menu also failed:", fallbackError);
      if (onQuit) onQuit();
    }
  }
}
