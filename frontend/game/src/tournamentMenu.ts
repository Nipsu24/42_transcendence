import { Scene } from '@babylonjs/core';
import { UIFactory } from './ui/UIFactory';
import { PlayerListUI } from './ui/PlayerListUI';
import { startTournament, cleanupTournament } from './tournament.js';
import { startMenu } from './menu.js';
import { getMe } from '../../src/services/players.js';

const MIN_PLAYERS = 3;
const MAX_PLAYERS = 16;

interface Friend {
  name: string;
  [key: string]: any;
}

interface Player {
  name: string;
  friends?: Friend[];
  [key: string]: any;
}

let me: Player;

export async function startTournamentMenu(
  canvas: HTMLCanvasElement,
  scene: Scene,
  onQuit?: () => void
) {
  console.log("Starting tournament menu...");
  
  try {
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

    const uiFactory = new UIFactory(canvas, scene, "TournamentMenuUI");
    
    uiFactory.createBackground();
    uiFactory.createBorder();
    uiFactory.createTitle("Tournament Setup", Math.floor(canvas.height * 0.07));
    
    const playerListUI = new PlayerListUI(canvas, scene, [me.name]);

    const cleanup = () => {
      uiFactory.dispose();
      playerListUI.dispose();
      cleanupTournament();
    };

    const handleAddFriend = () => {
      if (playerListUI.getPlayerCount() >= MAX_PLAYERS) {
        alert(`Maximum of ${MAX_PLAYERS} players reached.`);
        return;
      }
      if (!me.friends || me.friends.length === 0) {
        alert("You have no friends to add. Add some first!");
        return;
      }

      const friendNames = me.friends.map((f: Friend) => f.name).join(", ");
      const chosen = prompt(`Choose a friend to add: ${friendNames}`);

      let friend: Friend | null = null;
      for (let i = 0; i < me.friends.length; i++) {
        if (me.friends[i].name === chosen) {
          friend = me.friends[i];
          break;
        }
      }
      
      if (!friend) {
        alert("Invalid selection.");
        return;
      }
      
      const currentPlayers = playerListUI.getPlayers();
      let playerExists = false;
      for (let i = 0; i < currentPlayers.length; i++) {
        if (currentPlayers[i] === friend.name) {
          playerExists = true;
          break;
        }
      }
      
      if (playerExists) {
        alert(`${friend.name} is already in the tournament.`);
        return;
      }

      playerListUI.addPlayer(friend.name);
    };

    const handleRemoveLast = () => {
      if (playerListUI.getPlayerCount() <= 1) {
        alert("You cannot remove yourself from the tournament.");
        return;
      }
      playerListUI.removeLastPlayer();
    };

    const handleStartTournament = () => {
      if (playerListUI.getPlayerCount() < MIN_PLAYERS) {
        alert(`At least ${MIN_PLAYERS} players required!`);
        return;
      }
      cleanup();
      startTournament(canvas, scene, playerListUI.getPlayers(), () => {
        startMenu(canvas, scene, onQuit);
      });
    };

    const handleBack = () => {
      cleanup();
      startMenu(canvas, scene, onQuit);
    };

    const startY = 0.35;
    const spacing = 0.15;

    const buttonConfigs = [
      {
        text: "Add Friend",
        onClick: handleAddFriend,
        hoverColor: "#FE8915"
      },
      {
        text: "Remove Last",
        onClick: handleRemoveLast,
        hoverColor: "#FF4F1A"
      },
      {
        text: "Start Tournament",
        onClick: handleStartTournament,
        hoverColor: "#55CFD4"
      },
      {
        text: "Back",
        onClick: handleBack,
        hoverColor: "#0489C2"
      }
    ];

    buttonConfigs.forEach((config, index) => {
      uiFactory.createButton({
        text: config.text,
        top: `${(startY + spacing * index) * 100}%`,
        onClick: config.onClick,
        hoverColor: config.hoverColor
      });
    });

    console.log("Tournament menu UI created successfully");

    return cleanup;

  } catch (error) {
    console.error("Error in tournament menu:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : 'No stack trace');
    console.error("Canvas:", canvas);
    console.error("Scene:", scene);
    alert("Error loading tournament menu: " + (error instanceof Error ? error.message : 'Unknown error'));
    
    try {
      startMenu(canvas, scene, onQuit);
    } catch (fallbackError) {
      console.error("Fallback to main menu also failed:", fallbackError);
      if (onQuit) onQuit();
    }
  }
}
