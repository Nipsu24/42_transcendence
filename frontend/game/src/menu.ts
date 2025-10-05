import { Scene } from "@babylonjs/core";
import { MenuSystem } from './ui/MenuSystem';
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
  
  const menuSystem = new MenuSystem(canvas, scene, onQuit);

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

    const friendNames = me.friends.map((f: any) => f.name).join(", ");
    const chosen = prompt(`Choose an opponent: ${friendNames}`);
    let opponent = null;
    for (let i = 0; i < me.friends.length; i++) {
      if (me.friends[i].name === chosen) {
        opponent = me.friends[i];
        break;
      }
    }

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

  const cleanup = menuSystem.createDefaultGameMenu(player1Name, {
    onSinglePlayer: handleSinglePlayer,
    onTwoPlayers: handleTwoPlayers,
    onTournament: handleTournament,
    onQuit: handleQuit
  });

  return cleanup;
}
