// import { startMenu } from './menu.js';
// import { startPongMatch, stopPong } from './pong.js';

// const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
// const ctx = canvas.getContext('2d')!;

// let inGame = false;

// startMenu(canvas, ctx);

// document.addEventListener('keydown', (e) => {
//   if (e.key === 'Escape' && inGame) {
//     stopPong();
//     inGame = false;
//     startMenu(canvas, ctx);
//   }
// });

// export function launchGame() {
//   inGame = true;

//   startPongMatch(canvas, ctx, 'Player 1', 'Player 2', (winner) => {
//     inGame = false;
//     alert(`${winner} wins!`);
//     startMenu(canvas, ctx);
//   });
// }
