import type * as Party from "partykit/server";
import type { Game } from '../../types/index';
import { Codes } from '../../types/index';

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
      return new Response(JSON.stringify({ success: true, ...this.game }), {
        headers: this.getCORSHeaders(),
      });
    }

    if (req.method === 'GET') {
      return new Response(JSON.stringify(this.game || { success: false, message: "No game found" }), {
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
}
