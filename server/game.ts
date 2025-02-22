import { Game, Codes, GameStates } from '@/types/index'

export const createGame = async (host: string) => {
    console.log(process.env.NEXT_PUBLIC_PARTY_URL)
    const code = Math.random().toString(36).substring(2, 6).toUpperCase()
    const game: Game = {
        players: [{name:host, id:""}],
        host: {name:host, id:""},
        code: code,
        state: GameStates.LOBBY,
        omalaCount: 0,
        operations: [],
        omala: [],
        zomala: [],
        mahboos: "",
        currentPlayer: ""
    }
    const req = await fetch(`${process.env.NEXT_PUBLIC_PARTY_URL}/party/${code}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(game)
    })
    const res = await req.json()
    if (!res.success) {
        if(res.code === Codes.GAME_EXISTS) {
            // createGame(host)
            return "game exists"
        }
    }
    return res;
}

export const getGame = async (code: string) => {
    const req = await fetch(`${process.env.NEXT_PUBLIC_PARTY_URL}/party/${code}`, {
        method: 'GET'
    })
    const res = await req.json()
    return res;
}
