export type Game = {
    players: string[];
    host: string;
    code: string;
    started: boolean;
    };

export enum Codes {
    GAME_EXISTS = 'GAME_EXISTS',
}