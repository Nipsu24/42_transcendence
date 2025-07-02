export type Friend = {
	id: number;
	name: string;
	online: boolean;
  };
  
  export type MatchRequest = {
	playerTwoName?: string | null; // optional for AI matches
	resultPlayerOne: number;
	resultPlayerTwo: number;
	aiOpponent: boolean;
  };
  
  export type Match = {
	id: number;
	date: string;
	playerOneName: string;
	playerTwoName: string | null;
	resultPlayerOne: number;
	resultPlayerTwo: number;
	aiOpponent: boolean;
  };
  
  export type StatsRequest = {
	id?: number;
	victories: number;
	defeats: number;
	opponentName?: string | null;
	opponentVictories?: number | null;
	opponentDefeats?: number | null;
  };
  
  export type Stats = {
	id: number;
	victories: number;
	defeats: number;
	matches?: Match[];
  };
  
  export type Player = {
	id: number;
	name: string;
	password: string;
	e_mail?: string;
	online?: boolean;
	avatar?: string;
	stats?: Stats;
	friends?: Friend[];
  };
  