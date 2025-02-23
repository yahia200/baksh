import React from 'react'
import { Game } from '@/types/index'
import PartySocket from "partysocket";
import Ameel from '../svg/Ameel';
import Zemeel from '../svg/Zemeel';
import { Button } from '@/components/ui/button';

function Results({game, name, socket} : {game: Game, name: string, socket: PartySocket}) {
  return (
    <div className='mx-auto text-center space-y-2 mt-6'>
        <h1>Results</h1>
        <p>el wa2t el ba2y: {game.remainingTime}</p>
        <p>Ento 7abasto {game?.mahboos}</p>
        <p>
            w howa kan {game?.omala.includes(game?.mahboos) ? '3ameel' : 'zemeel'}
        </p>
        <div className='mx-auto w-fit'>
        {game?.omala.includes(game?.mahboos) ? <Ameel /> : <Zemeel />}
        </div>
        <p>
            El kasbaneen: {game?.winners}
        </p>
        {game?.host.name === name &&
        <div className='mx-auto w-11/12 mt-6'>
            <Button className='w-full' onClick={() => socket.send(JSON.stringify({type: 'reset', name: name}))}>
                Reset
            </Button>
        </div>
}
    </div>
  )
}

export default Results