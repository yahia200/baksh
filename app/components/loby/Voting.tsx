
'use client'
import React, { useState, useEffect } from 'react'
import { Game } from '@/types/index'
import { Button } from '@/components/ui/button'
import PartySocket from "partysocket";


function Voting({g, name, socket} : {g: Game, name: string, socket: PartySocket}) {
    const [game, setGame] = useState<Game>();

    useEffect(() => {
        setGame(g);
    }, [g]);

  return (
    <div className='mx-auto text-center space-y-1 mt-6'>
        <h1 className='text-2xl font-bold text-center'>Voting</h1>
        <p className='font-normal text-lg text-center'>lazem t5tar te7bs meen abl ma el wa2t ye5las</p>
        <p className='font-normal text-lg text-center'>el wa2t el ba2y: {game?.remainingTime}</p>
        {!game?.players.find(p=> p.name === name)?.ready ?
            <>
        <div className='mx-auto w-fit grid grid-cols-2 gap-4 py-6'>
            {game?.players.filter(p => p.name !== name).map(p => (
                <div className='mx-auto w-fit' key={p.id}>
                    <Button className={`mx-auto w-fit ${game?.votes?.find(v => v.voter === name && v.voted === p.name) && 'bg-primary-hover'}`}
                    onClick={() => socket.send(JSON.stringify({type: 'vote', name: name, player: p.name}))}
                    >{p.name}</Button>
                </div>
            ))}
            </div>
        <div className='mx-auto w-11/12'>
            <Button className='w-full' disabled={!game?.votes?.find(v => v.voter === name) || game.players.find(p=> p.name === name)?.ready } onClick={() => socket.send(JSON.stringify({type: 'ready', name: name}))}>
                Skip
            </Button>
            </div>
            </>
            :
            <div className='mx-auto w-11/12'>
            <p className='font-normal text-lg text-center py-6'>Enta 3amalt el vote l {game?.votes?.find(v => v.voter === name)?.voted}</p>
            <Button className='w-full' onClick={() => socket.send(JSON.stringify({type: 'unready', name: name}))}>
                Erga3
            </Button>
            </div>

}
        </div>
  )
}

export default Voting