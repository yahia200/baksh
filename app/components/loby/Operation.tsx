'use client'
import React, { useState, useEffect } from 'react'
import { Game, GameStates } from '@/types'
import PartySocket from "partysocket";
import { Button } from '@/components/ui/button'
import Sabooba from '../svg/Sabooba';
import Eatrf from '../svg/Eatrf';
import Maloma from '../svg/Maloma';
import Shoraka from '../svg/Shoraka';
import Ameel from '../svg/Ameel';
import Zemeel from '../svg/Zemeel';





function Operation({g, name, socket} : { g : Game, name : string, socket : PartySocket }) {
    const [game, setGame] = useState<Game>();

    useEffect(() => {
        setGame(g);
    }, [g]);

    const renderImage = (op : string) => {
        switch(op) {
            case 'Sabooba':
                return <Sabooba />;
            case 'E3trf':
                return <Eatrf />;
            case 'Maalooma':
                return <Maloma />;
            case 'Shoraka':
                return <Shoraka />;
            default:
                return null;
        }
    }

    const render = () => {
        if(game?.state === GameStates.EATRAF) {
            console.log("beeb",game?.operations.find(op => op.name === 'E3trf')?.player);
            const player = game?.operations.find(op => op.name === 'E3trf')?.player || "";
            return (
                <div className='mx-auto text-center w-fit'>
                <h1 className='w-fit mx-auto text-center'>
                    {player} e3taraflak eno {game?.omala.includes(player) ? '3ameel' : 'zemeel'}
                </h1>
                <p className='font-normal text-lg text-center'>el wa2t el ba2y: {game?.remainingTime}</p>
                {game?.omala.includes(player) ? <Ameel /> : <Zemeel />}
                    </div>
            )
        }
        else{
        return(
        <h1>{
            game?.operations.filter(op => op.player === name && !op.done).map(op => (
                <div className='mx-auto text-center space-y-1 mt-6' key={op.name}>
                    <h2 className='text-2xl font-bold'>{op.name}</h2>
                    <p className='font-normal'>{op.description}</p>
                    <p className='font-normal text-lg text-center'>el wa2t el ba2y: {game?.remainingTime}</p>
                    <div className='mx-auto w-fit'>{renderImage(op.name)}</div>
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
      <div className='mx-auto w-11/12 mt-6'>
        {(game?.currentPlayer.toString() !== game?.operations.find(op => op.name === "E3trf")?.player?.toString()) &&
      <Button className='w-full' onClick={() => socket.send(JSON.stringify({type: 'endTurn', name}))}>End Turn</Button>
        }
      </div>
      </div>
  )
}

export default Operation