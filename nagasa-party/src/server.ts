import type * as Party from "partykit/server";
import type { Game } from '../../types/index';
import { Codes } from '../../types/index';

export default class Server implements Party.Server {
  constructor(readonly party: Party.Room) {}

  game: Game | undefined;

  async onRequest(req: Party.Request): Promise<Response> {
    if (req.method === 'POST') {
      if(this.game) 
        return new Response(JSON.stringify({success: false, code: Codes.GAME_EXISTS }));
      const game = await req.json() as Game;
      this.game = game;
    }

    if (req.method === 'GET') {
      return new Response(JSON.stringify(this.game));
    }

    if (req.method === 'DELETE') {
      this.game = undefined;
      return new Response(JSON.stringify({success: true}));
    }

    if (this.game) {
      return new Response(JSON.stringify({success: true,...this.game}));
    }



    return new Response('No game found');
  }



}



Server satisfies Party.Worker;
