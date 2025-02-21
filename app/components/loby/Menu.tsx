'use client'
import { Button } from '@/components/ui/button'
import React from 'react'
import PartySocket from "partysocket";
import { Game } from '@/types'


function Menu({ game, name, socket, endGame }: { game?: Game, name?: string, endGame: () => void, socket: PartySocket }) {

  return (
    <div className='w-11/12 flex flex-col items-center mx-auto space-y-4'>
      <div className='w-11/12 mx-auto my-4 bg-foreground p-4 rounded-lg'>
          <h2 className='text-2xl w-fit mx-auto'>Players</h2>
          <ul className='w-11/12 mx-auto my-4 grid lg:grid-cols-7 xs:grid-cols-3 gap-2'>
            {game?.players.map((player : {name:string, id:string}) => (
              <li key={player.id} className='text-xl font-normal bg-background px-4 py-2 w-fit rounded-lg'>
                <span>{player.name}</span>
              </li>
            ))}
          </ul>
        </div>
        <hr className='w-1/2 mx-auto my-4 border-2 border-text'/>
      {name === game?.host.name && (
        <>
      <Button className='w-11/12'
      onClick={() => socket.send(JSON.stringify({type: 'start', id: socket.id}))}
      >Start Game</Button>
        <Button className='w-11/12' onClick={endGame}>
          End Game
          </Button>
          </>
      )}
      <Button className='w-11/12' onClick={() => {
        socket.send(JSON.stringify({type: 'disconnect', id: socket.id}));
        window.location.href = '/'}}>
        Leave Game
      </Button>
    </div>
  );
}

export default Menu;