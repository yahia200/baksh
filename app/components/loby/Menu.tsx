'use client'
import { Button } from '@/components/ui/button'
import React from 'react'
import PartySocket from "partysocket";
import { Game } from '@/types'


function Menu({ game, name, socket, endGame }: { game?: Game, name?: string, endGame: () => void, socket: PartySocket }) {


  const toggleReady = () => {
    const player = game?.players.find(player => player.id === socket.id);
    if (!player) return;
    player.ready = !player.ready;
    if (player.ready) socket.send(JSON.stringify({type: 'ready', id: socket.id}))
    else socket.send(JSON.stringify({type: 'unready', id: socket.id}))
  }


  return (
    <div className='w-11/12 flex flex-col items-center mx-auto space-y-4'>
      <div className='w-11/12 mx-auto my-4 bg-foreground p-4 rounded-lg'>
          <h2 className='text-2xl w-fit mx-auto'>Players</h2>
          <ul className='w-fit mx-auto my-4 grid lg:grid-cols-7 xs:grid-cols-4 gap-2'>
            {game?.players.map((player : {name:string, id:string}) => (
              <li key={player.id} className='text-xl font-normal bg-background px-4 py-2 w-fit rounded-lg'>
                <span>{player.name}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className='w-11/12 mx-auto my-4 p-4 rounded-lg'>
        <p className='text-2xl w-fit mx-auto'>
          3adad el omala
          </p>
          <div className='w-fit mx-auto my-4 grid grid-cols-5 gap-2'>
          {
            Array.from({length: 5}, (_, i) => (
              <Button
                className={`${i+2 < 0.5*(game?.players.length || 0) ? `w-[5ch] ${game?.omalaCount === i+2 ? 'bg-primary-hover' : 'bg-foreground'}` : "bg-foreground opacity-30 w-[5ch] pointer-events-none"} ${name !== game?.host.name && 'pointer-events-none'}`}
               key={i+2} 
               onClick={() => socket.send(JSON.stringify({type: 'setOmala', omalaCount: i+2, id: socket.id}))}>{i+2}</Button>
            ))
          }
          </div>
        </div>
        <hr className='w-1/2 mx-auto my-4 border-2 border-text'/>
      {name === game?.host.name ? (
        <>
      <Button className='w-11/12'
      onClick={() => socket.send(JSON.stringify({type: 'start', id: socket.id}))}
      disabled={game?.players.filter(p=>p.name !== name).some(player => !player.ready) || (game?.players.length || 0) < 3 || (game?.omalaCount || 0) < 1}
      >
        {game?.players.filter(p=>p.name !== name).some(player => !player.ready) ? 'El la3eba mesh gahza' : "ebda2"}
      </Button>
        <Button className='w-11/12' onClick={endGame}>
          End Game
          </Button>
          </>
      ) :
      <Button className='w-11/12' onClick={toggleReady}>
        {game?.players.find(player => player.id === socket.id)?.ready ? 'Unready' : 'Ready'}
      </Button>
    }
      <Button className='w-11/12' onClick={() => {
        socket.send(JSON.stringify({type: 'disconnect', id: socket.id}));
        window.location.href = '/'}}>
        Leave Game
      </Button>
    </div>
  );
}

export default Menu;