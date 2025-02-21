export type Game = {
    players: {name:string, id: string}[];
    host: {name:string, id: string};
    code: string;
    state: GameStates;
    };

export enum Codes {
    GAME_EXISTS = 'GAME_EXISTS',
    GAME_NOT_FOUND = 'Mafish game b el code dah'
}

export enum GameStates {
    LOBBY = 'LOBBY',
    STARTED = 'STARTED',
    ENDED = 'ENDED'
}