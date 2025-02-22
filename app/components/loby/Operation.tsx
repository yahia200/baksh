'use client'
import React, { useState, useEffect } from 'react'
import { Game, GameStates } from '@/types'
import PartySocket from "partysocket";
import { Button } from '@/components/ui/button'

function Operation({g, name, socket} : { g : Game, name : string, socket : PartySocket }) {
    const [game, setGame] = useState<Game>();

    useEffect(() => {
        setGame(g);
    }, [g]);

    const render = () => {
        if(game?.state === GameStates.EATRAF) {
            console.log("beeb",game?.operations.find(op => op.name === 'E3trf')?.player);
            const player = game?.operations.find(op => op.name === 'E3trf')?.player || "";
            return (
                <h1 className='text-center'>
                    {player} e3taraflak eno {game?.omala.includes(player) ? '3ameel' : 'zemeel'}
                </h1>
            )
        }
        else{
            console.log("beeb",game);
        return(
        <h1>{
            game?.operations.filter(op => op.player === name && !op.done).map(op => (
                <div className='mx-auto text-center space-y-1 mt-6' key={op.name}>
                    <h2 className='text-2xl font-bold'>{op.name}</h2>
                    <p className='font-normal'>{op.description}</p>
                    { op.name === 'E3trf' ?
                    <div className='w-fit mx-auto pt-8 grid grid-cols-2 gap-4'>
                        {game?.players.filter(player => player.name !== name).map(player => (
                            <Button className='w-24'
                            onClick={() => socket.send(JSON.stringify({type: 'e3trf', name: name, target: player.name}))} key={player.name}
                            >{player.name}</Button>
                        ))}
                    </div>
                    :
                    <ul>
                        {op.options.map(option => (
                            <li className='mt-4' key={option}>{option}</li>
                        ))}
                    </ul>
    }
                </div>
            ))
          }</h1>
        ) 
    }
    }

  return (
    <div>
        {render()}
      <div className='mx-auto w-fit mt-6'>
        {(game?.currentPlayer.toString() !== game?.operations.find(op => op.name === "E3trf")?.player?.toString()) &&
      <Button onClick={() => socket.send(JSON.stringify({type: 'endTurn', name}))}>End Turn</Button>
        }
      </div>
      </div>
  )
}

export default Operation