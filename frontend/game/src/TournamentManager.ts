import { getMe } from '../../src/services/players.js';
import { updateMyStats } from "./apiCalls.js";
import { createRecord } from './apiCalls.js';

export interface Match {
  player1: string;
  player2: string | null;
  winner: string | null;
}

export class TournamentManager {
  private players: string[];
  public currentRound: Match[] = [];
  private currentMatchIndex = 0;
  private champion: string | null = null;

  constructor(players: string[]) {
    this.players = [...players];
    this.shufflePlayers();
    this.createRound(this.players);
  }

  private shufflePlayers() {
    for (let i = this.players.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.players[i], this.players[j]] = [this.players[j], this.players[i]];
    }
  }

  private createRound(players: string[]) {
    this.currentRound = [];
    this.currentMatchIndex = 0;

    for (let i = 0; i < players.length; i += 2) {
      const p1 = players[i];
      const p2 = players[i + 1] || null;
      const match: Match = {
        player1: p1,
        player2: p2,
        winner: p2 === null ? p1 : null, // auto-win on bye
      };
      this.currentRound.push(match);
    }
  }


  public hasNextMatch(): boolean {
    return this.getNextMatch() !== null;
  }


  public getNextMatch(): Match | null {
    for (let i = 0; i < this.currentRound.length; i++) {
      const match = this.currentRound[i];
      if (!match.winner && match.player2 !== null) {
        this.currentMatchIndex = i;
        return match;
      }
    }
    return null;
  }


  public async recordWinner(winner: string, leftScore: number, rightScore: number) {
    const match = this.currentRound[this.currentMatchIndex];
    if (!match || match.winner) return;

    match.winner = winner;

    // save match record
    if (match.player2) {
      await createRecord({
        playerTwoName: match.player2,
        resultPlayerOne: winner === match.player1 ? leftScore : rightScore,
        resultPlayerTwo: winner === match.player1 ? rightScore : leftScore,
        aiOpponent: false,
      });
    }

    // update stats
    const me = await getMe();
    if (winner === me.name) {
      await updateMyStats({
        victories: me.stats.victories + 1,
        defeats: me.stats.defeats,
      });
    } else {
      await updateMyStats({
        victories: me.stats.victories,
        defeats: me.stats.defeats + 1,
      });
    }

    const allDecided = this.currentRound.every(m => m.winner !== null);
    if (allDecided) {
      const winners = this.currentRound.map(m => m.winner!).filter(Boolean);
      if (winners.length === 1) {
        this.champion = winners[0];
      } else {
        this.createRound(winners);
      }
    }
  }

  public isFinished(): boolean {
    return this.champion !== null;
  }

  public getChampion(): string | null {
    return this.champion;
  }
}
