import type * as Party from "partykit/server";
import type { Game } from '../../types/index';
import { Codes, GameStates } from '../../types/index';

export default class Server implements Party.Server {
  constructor(readonly party: Party.Room) {}

  game: Game | undefined;

  async onRequest(req: Party.Request): Promise<Response> {
    // Handle CORS Preflight (OPTIONS requests)
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: this.getCORSHeaders(),
      });
    }

    if (req.method === 'POST') {
      const game = await req.json() as Game;
      if (this.game) {
        if (game.host === this.game.host) 
          return new Response(JSON.stringify({ success: true, ...this.game }), {
            headers: this.getCORSHeaders(),
          });
        return new Response(JSON.stringify({ success: false, code: Codes.GAME_EXISTS }), {
          headers: this.getCORSHeaders(),
        });
      }
      this.game = game;
      this.game.players = [game.host];
      console.log("created game:", this.game);
      return new Response(JSON.stringify({ success: true, ...this.game }), {
        headers: this.getCORSHeaders(),
      });
    }

    if (req.method === 'GET') {
      if (!this.game) 
        return new Response(JSON.stringify({ success: false, code: Codes.GAME_NOT_FOUND }), {
          headers: this.getCORSHeaders(),
        });
      return new Response(JSON.stringify({...this.game, success: true}), {
        headers: this.getCORSHeaders(),
      });
    }

    if (req.method === 'DELETE') {
      this.game = undefined;
      return new Response(JSON.stringify({ success: true }), {
        headers: this.getCORSHeaders(),
      });
    }

    return new Response(JSON.stringify({ success: false, message: "Invalid request" }), {
      headers: this.getCORSHeaders(),
    });

  }

  // Helper function to return CORS headers
  private getCORSHeaders(): HeadersInit {
    return {
      "Access-Control-Allow-Origin": "*", // Allow only your frontend domain
      "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Credentials": "true",
    };
  }

  private disconnectPlayer(id: string) {
    console.log('disconnected');
    if (!this.game) return;
      if(this.game.players.length <= 1)
        { this.game = undefined;
          return
        }
      this.game.players = this.game.players.filter(player => player.id !== id);
      if (this.game?.host.id === id) {
        this.game.host = this.game.players[0];
      }
    this.party.broadcast(JSON.stringify(this.game));
  }

  async onConnect(connection: Party.Connection, ctx: Party.ConnectionContext): Promise<void> {
    //console.log(connection);
  }

  async onDisconnect(connection: Party.Connection, ctx: Party.ConnectionContext): Promise<void> {
    this.disconnectPlayer(connection.id);
  }

  async onMessage(message: string): Promise<void> {
    if (!this.game) return;
    const data = JSON.parse(message);
    console.log(data);
    if (data.type === 'join'){
      if(this.game.players.find(player => player.name === data.name)){
        if (this.game.host.name === data.name) {
          this.game.host.id = data.id;
        }
        this.game.players = this.game.players.map(player => {
          if (player.name === data.name) {
            player.id = data.id;
          }
          return player;
        });
      }
      else
      this.game.players.push({name:data.name, id: data.id});
    }

    if(data.type === 'delete') 
      this.game = undefined;



    if(data.type === 'disconnect') {
      this.disconnectPlayer(data.id);
    }

    if(data.type === 'start') {
      if (!this.game) return;
      if (this.game.host.id !== data.id) return;
      this.game.state = GameStates.STARTED;
    }

    
    console.log(this.game);
    this.party.broadcast(JSON.stringify(this.game));
  }


}
