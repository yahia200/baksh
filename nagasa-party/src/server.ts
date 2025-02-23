import type * as Party from "partykit/server";
import type { Game } from '../../types/index';
import type { Operation } from '../../types/index';
import { Codes, GameStates, operations, maalooma } from '../../types/index';

const turnTime = 10000;
const votingTime = 120000;

export default class Server implements Party.Server {
  constructor(readonly party: Party.Room) {}

  game: Game | undefined;
  timer: NodeJS.Timeout | undefined;
  interval: NodeJS.Timeout | undefined;

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

  private unreadyPlayers() {
    if (!this.game) return;
    this.game.players = this.game.players.map(player => {
      player.ready = false;
      return player;
    });
  }

  async onConnect(connection: Party.Connection, ctx: Party.ConnectionContext): Promise<void> {
    //console.log(connection);
  }

  async onDisconnect(connection: Party.Connection, ctx: Party.ConnectionContext): Promise<void> {
    this.disconnectPlayer(connection.id);
  }

  private endVoting() {
    if (!this.game) return;
      this.game.state = GameStates.ENDED;
      let votes : {palyer: string, count: number}[] = [];
      for (const vote of this.game.votes) {
        const player = votes.find(v => v.palyer === vote.voted);
        if (player) {
          player.count += 1;
        } else {
          votes.push({palyer: vote.voted, count: 1});
        }
      }
      const mahboos = votes.sort((a, b) => b.count - a.count)[0];
      this.game.mahboos = mahboos.palyer;
      this.game.winners = this.checkWin();
      this.party.broadcast(JSON.stringify(this.game));
  }

  private startTurnTimer(playerName: string) {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.game!.remainingTime = turnTime/1000;
    this.timer = setTimeout(() => {
      this.endTurn(playerName);
    }, turnTime);
  }

  private startVotingTimer() {
    if(!this.game || this.game.state !== GameStates.VOTING) return;
    if (this.timer) {
      clearTimeout(this.timer);
    }


    this.game!.remainingTime = votingTime/1000;
    this.timer = setTimeout(() => {
      this.endVoting();
    }, votingTime);
  }

  private endTurn(playerName: string) {
    if (!this.game) return;
    if (this.game.currentPlayer !== playerName) return;

    if (this.game.state !== GameStates.EATRAF){
      this.game.operations = this.game.operations.map(op => {
        if (op.player === playerName) {
          op.done = true;
        }
        return op;
      });
    } else {
      this.game.state = GameStates.STARTED;
    }

    const remainingPlayers = this.game.operations.filter(op => !op.done).map(op => op.player);
    if (remainingPlayers.length === 0) {
      this.game.state = GameStates.VOTING;
      this.startVotingTimer();
    } else {
      this.game.currentPlayer = remainingPlayers[Math.floor(Math.random() * remainingPlayers.length)] || "";
      this.startTurnTimer(this.game.currentPlayer);
    }

    this.party.broadcast(JSON.stringify(this.game));
  }

  private resetGame() {
    if (!this.game) return;
    this.game.mahboos = "";
    this.game.operations = [];
    this.game.omala = [];
    this.game.zomala = [];
    this.game.sabooba = undefined;
    this.game.state = GameStates.LOBBY;
    this.unreadyPlayers();
    this.game.votes = [];
    this.game.currentPlayer = "";
    this.game.remainingTime = 0;
    if (this.interval) {
      clearInterval(this.interval);
    }
    if (this.timer) {
      clearTimeout(this.timer);
    }
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
      let omala : string[] = [];
      while (omala.length < this.game.omalaCount) {
        const player = this.game.players[Math.floor(Math.random() * this.game.players.length)];
        if (!omala.includes(player.name)) {
          omala.push(player.name);
        }
      }
      this.game.omala = omala;
      this.unreadyPlayers();
      const zomala = this.game.players.map(player => player.name).filter(player => !omala.includes(player));
      this.game.zomala = zomala;
      let ops = structuredClone(operations);
      for (const player of this.game.players) {
        if (ops.length > 0) {
          const op = ops.splice(Math.floor(Math.random() * ops.length), 1)[0];
          console.log("ahhhhhh",ops.length, op.name);
        this.game.operations.push({...op, 
          options: this.getOptions(op, player.name),
          player: player.name, done: false});
        if (op.name === 'Sabooba') {
          this.game.sabooba = {option: this.game.operations[this.game.operations.length - 1].options[0], player: player.name};
        }
        }
        else{
          console.log("oooohhh");
        this.game.operations.push({...maalooma,
          options: this.getOptions(maalooma, player.name),
          player: player.name, done: false});
        }
      }
      this.game.currentPlayer = this.game.players[Math.floor(Math.random() * this.game.players.length)].name;
      this.game.state = GameStates.INFO;
      this.interval = setInterval(() => {
        if (!this.game) return;
        this.game.remainingTime -= 1;
        this.party.broadcast(JSON.stringify(this.game));
      }, 1000);
    }

    if(data.type === 'setOmala') {
      if (!this.game) return;
      if (this.game.host.id !== data.id) return;
      this.game.omalaCount = data.omalaCount;
    }

    if(data.type === 'ready') {
      if (!this.game) return;
      const player = this.game.players.find(player => player.name === data.name);
      if (!player) return;
      player.ready = true;
      const allReady = this.game.players.every(player => player.ready);
      if (allReady) {
        this.unreadyPlayers();
        if (this.game.state === GameStates.INFO) {
          this.game.state = GameStates.STARTED;
          this.startTurnTimer(this.game.currentPlayer);
        }
        if (this.game.state === GameStates.VOTING) {
          this.endVoting();
        }
    }
  }

  if (data.type === 'reset') {
    if (!this.game) return;
    if (this.game.host.name !== data.name) return;
    this.resetGame();
  }

    if(data.type === 'unready') {
      if (!this.game) return;
      const player = this.game.players.find(player => player.name === data.name);
      if (!player) return;
      player.ready = false;
    }

    if(data.type === 'endTurn') {
      this.endTurn(data.name);
    }

    if (data.type === 'e3trf') {
      if (!this.game) return;
      const op = this.game.operations.find(op => op.player === data.name && op.name === 'E3trf');
      if (!op) return;
      op.done = true;
      const player = this.game.players.find(player => player.name === data.target);
      if (!player) return;
      this.game.state = GameStates.EATRAF;
      this.game.currentPlayer = player.name;
      this.startTurnTimer(this.game.currentPlayer);
    }

    if (data.type === 'vote') {
      if (!this.game) return;
      if (this.game.state !== GameStates.VOTING) return;
      if (this.game.votes.find(vote => vote.voter === data.name)) {
        this.game.votes = this.game.votes.map(vote => {
          if (vote.voter === data.name) {
            vote.voted = data.player;
          }
          return vote;
        });
      }
      else {
        this.game.votes.push({voter: data.name, voted: data.player});
      }
    }

    console.log(this.game);
    this.party.broadcast(JSON.stringify(this.game));
  }

  private getOptions(op: Operation, player: string) : string[] {
    let option = undefined;
    switch (op.name) {
      case 'Sabooba':
        option = op.options.splice(Math.floor(Math.random() * op.options.length), 1)[0];
        console.log("optionaaa", option, op.options);
        switch (option) {
          case 'lw 7abast *':
            return [`lw 7abast ${this.game?.players.filter(p => p.name !== player)[Math.floor(Math.random() * this.game?.players.length)].name}`];
          case 'lw * keseb':
            return [`lw ${this.game?.players.filter(p => p.name !== player)[Math.floor(Math.random() * this.game?.players.length)].name} keseb`];
          case 'lw el 3omala kesbo':
            return [option];
          case 'lw et7abast':
            return [option];
          default:
            console.log("default");
            return ["baizaaaa"];
        }
        

      case 'Maalooma':
        option = op.options.splice(Math.floor(Math.random() * op.options.length), 1)[0];
        switch (option) {
          case '* 3ameel':
            if (this.game?.omala.includes(player)) {
              return [`${this.game?.zomala[Math.floor(Math.random() * this.game?.zomala.length)]} zemeel`];
            }
            return [`${this.game?.omala[Math.floor(Math.random() * this.game?.omala.length)]} 3ameel`];
          case '* zemeel':
            return [`${this.game?.zomala.filter(p => p !== player)[Math.floor(Math.random() * this.game?.zomala.length)]} zemeel`];
          case '* zai *':
            const za = Math.random() > 0.75 ? '3ameel' : 'zemeel';
            if (za === '3ameel') {
              const ameel1 = this.game?.omala[Math.floor(Math.random() * this.game?.omala.length)];
              const filter = this.game?.omala.filter(p => p !== ameel1) || [];
              return [`${ameel1} zai ${filter[Math.floor(Math.random() * filter.length)]}`];
            }
            const zemeel1 = this.game?.zomala[Math.floor(Math.random() * this.game?.zomala.length)];
            const filter = this.game?.zomala.filter(p => p !== zemeel1) || [];
            return [`${zemeel1} zai ${filter[Math.floor(Math.random() * filter.length)]}`];
          case '* mesh zai *':
            return [`${this.game?.omala.filter(p => p !== player)[Math.floor(Math.random() * this.game?.omala.length)]} mesh zai ${this.game?.zomala.filter(p => p !== player)[Math.floor(Math.random() * this.game?.zomala.length)]}`];
          }


      case 'Shoraka':
        const shereek = Math.random() > 0.75 ? '3ameel' : 'zemeel';
            if (shereek === '3ameel') {
              const ameel1 = this.game?.omala[Math.floor(Math.random() * this.game?.omala.length)];
              const filter = this.game?.omala.filter(p => p !== ameel1) || [];
              return [`${ameel1} w ${filter[Math.floor(Math.random() * filter.length)]} shoraka`];
            }
            
            const zemeel1 = this.game?.zomala[Math.floor(Math.random() * this.game?.zomala.length)];
            console.log("zmeel",zemeel1, this.game?.zomala);
            const filter = this.game?.zomala.filter(p => p !== zemeel1) || [];
            return [`${zemeel1} w ${filter[Math.floor(Math.random() * filter.length)]} shoraka`];
            

      case 'E3trf':
        return ['*'];
  }

  return [];
}

  private checkSaboba(option: string) {
    if (!this.game) return;
    const split = option.split(' ');

    if (split.includes('7abast')) {
      return this.game.mahboos === split[2];
    }

    if (split.includes('keseb')) {
      const player = split[1];
      if (this.game.omala.includes(player)) {
        return this.game.zomala.includes(this.game.mahboos);
      }
      return this.game.omala.includes(this.game.mahboos);
    }

    if (split.includes('kesbo')) {
      return this.game.omala.includes(this.game.mahboos);
    }

    if (split.includes('et7abast')) {
      return this.game.mahboos === this.game.sabooba?.player;
    }
  }

  private checkWin() {
    if (!this.game) return;
    if(this.game.omala.includes(this.game.mahboos) && this.game.omala.includes((this.game.sabooba?.player || "")) && this.checkSaboba(this.game.sabooba?.option || "")) {
      return `El zmail w ${this.game.sabooba?.player}`;
    }

    if(this.game.zomala.includes(this.game.mahboos) && this.game.zomala.includes((this.game.sabooba?.player || "")) && this.checkSaboba(this.game.sabooba?.option || "")) {
      return `El omala w ${this.game.sabooba?.player}`;
    }

    console.log("mahboos", this.game.mahboos);
    if (this.game.omala.includes(this.game.mahboos)) {
      return "El zomala";
    }

    if (this.game.zomala.includes(this.game.mahboos)) {
      return "El omala";
    }

    return "mesh 3aref";
  }

}