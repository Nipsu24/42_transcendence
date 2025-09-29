import { Scene } from "@babylonjs/core";
import * as GUI from "@babylonjs/gui";
import { startTournamentMenu } from './tournamentMenu.js';
import { startPongMatch } from './3dPong';
import { getMe } from '../../src/services/players.js';
import { createRecord } from './apiCalls.js';

export async function startMenu(
  canvas: HTMLCanvasElement,
  scene: Scene,
  onQuit?: () => void
) {

  let player1Name = "Player 1";
  try {
    const me = await getMe();
    player1Name = me.name;
  } catch (err) {
    console.error("Could not fetch user:", err);
  }
  console.log("Player name:", player1Name);
  
  const ui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("GameMenuUI");

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
  title.text = "PONG";
  title.fontFamily = "futura-pt, sans-serif";
  title.color = "white";
  title.fontSize = Math.floor(canvas.height * 0.08);
  title.fontWeight = "bold";
  title.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  title.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
  title.top = "15%";
  title.alpha = 1.0;
  ui.addControl(title);

  const welcome = new GUI.TextBlock();
  welcome.text = `Welcome, ${player1Name}`;
  welcome.color = "#cccccc";
  welcome.fontSize = Math.floor(canvas.height * 0.04);
  welcome.fontFamily = "futura-pt, sans-serif";
  welcome.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  welcome.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
  welcome.top = "25%";
  welcome.alpha = 1.0;
  ui.addControl(welcome);

  let y = 0.35;
  const space = 0.15;

  const buttonWidth = "30%";
  const buttonHeight = "8%";

  const buttons: GUI.Button[] = [];

  async function handleSinglePlayer() {
    cleanup();

    startPongMatch(canvas, scene, true, player1Name, "AI player", async (winner, leftScore, rightScore) => {
      const me = await getMe();
      if (winner !== "") {
        alert(`${winner} wins!`);
        await createRecord({
          playerOneName: player1Name,
            resultPlayerOne: leftScore,
            resultPlayerTwo: rightScore,
            aiOpponent: true
          });
        }
        startMenu(canvas, scene, onQuit);
      });
    }

  async function handleTwoPlayers() {
    cleanup();
    const me = await getMe();

    if (!me.friends || me.friends.length === 0) {
      alert("You have no friends to play against. Add some first!");
      startMenu(canvas, scene, onQuit);
      return;
    }

    const friendNames = me.friends.map(f => f.name).join(", ");
    const chosen = prompt(`Choose an opponent: ${friendNames}`);
    const opponent = me.friends.find(f => f.name === chosen);

    if (!opponent) {
      alert("Invalid selection.");
      startMenu(canvas,  scene, onQuit);
      return;
    }

    startPongMatch(canvas, scene, false, me.name, opponent.name, async (winner, leftScore, rightScore) => {
      if (winner !== "") {
        alert(`${winner} wins!`);
        await createRecord({
          playerOneName: player1Name,
          playerTwoName: opponent.name,
          resultPlayerOne: leftScore,
          resultPlayerTwo: rightScore,
          aiOpponent: false,
        });
      }
      startMenu(canvas, scene, onQuit);
    });
  }

  function handleTournament() {
    cleanup();
    startTournamentMenu(canvas, scene, onQuit);
  }

  function handleQuit() {
    cleanup();
    if (onQuit) {
      onQuit();
    } else {
      window.location.href = '/gamemenu';
    }
  }

  const buttonConfigs = [
    { text: "1 Player", top: `${y * 100}%`, onClick: handleSinglePlayer, hoverColor: "#FE8915" },
    { text: "2 Players", top: `${(y + space) * 100}%`, onClick: handleTwoPlayers, hoverColor: "#FF4F1A" },
    { text: "Tournament", top: `${(y + space * 2) * 100}%`, onClick: handleTournament, hoverColor: "#55CFD4" },
    { text: "Quit", top: `${(y + space * 3) * 100}%`, onClick: handleQuit, hoverColor: "#0489C2" },
  ];

  buttonConfigs.forEach(cfg => {
    const button = GUI.Button.CreateSimpleButton(`btn_${cfg.text}`, cfg.text);
    button.width = buttonWidth;
    button.height = buttonHeight;
    button.color = "white";
    button.background = "rgba(51, 51, 51, 0.9)";
    button.cornerRadius = 0;
    button.thickness = 3;
    button.fontSize = Math.floor(canvas.height * 0.035);
    button.fontWeight = "bold";
    button.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    button.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    button.top = cfg.top;

    button.onPointerEnterObservable.add(() => {
      button.background = cfg.hoverColor;
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

    button.onPointerClickObservable.add(() => cfg.onClick());

    ui.addControl(button);
    buttons.push(button);
  });

  function cleanup() {
    buttons.forEach(btn => btn.dispose());
    ui.dispose();
  }
  return cleanup;
}
