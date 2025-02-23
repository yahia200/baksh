export type Game = {
    players: {name:string, id: string, ready?: boolean}[];
    host: {name:string, id: string};
    code: string;
    state: GameStates;
    omalaCount: number;
    operations: Operation[];
    sabooba?: {option: string, player: string};
    omala: string[];
    zomala: string[];
    mahboos: string;
    votes: {voter: string, voted: string}[];
    currentPlayer: string;
    remainingTime: number;
    winners?: string;
    };


export enum Codes {
    GAME_EXISTS = 'GAME_EXISTS',
    GAME_NOT_FOUND = 'Mafish game b el code dah'
}

export enum GameStates {
    LOBBY = 'LOBBY',
    STARTED = 'STARTED',
    VOTING = 'VOTING',
    ENDED = 'ENDED',
    EATRAF = 'EATRAF',
    INFO = 'INFO'
}

export type Operation = {
    name: string;
    description: string;
    player?: string;
    options: string[];
    done?: boolean;
};

export const sabooba: Operation = {
    name: 'Sabooba',
    description: 'galak sabooba, momken teksab lw 3amalt el 7aga deh',
    options: ['lw 7abast *', 'lw * keseb', 'lw el 3omala kesbo', 'lw et7abast']
};

export const maalooma: Operation = {
    name: 'Maalooma',
    description: 'galak maalooma, mates2alsh gat mneen',
    options: ['* 3ameel', '* zemeel', '* zai *', '* mesh zai *']
};

export const shoraka: Operation = {
    name: 'Shoraka',
    description: 'El 2 dol shoraka',
    options: ['* w *']
};

export const eatrf: Operation = {
    name: 'E3trf',
    description: 'lazem t5tar 7ad t3trflo enta zemeel walla 3ameel',
    options: ['*']
};

export const operations = [sabooba, maalooma, shoraka, eatrf];