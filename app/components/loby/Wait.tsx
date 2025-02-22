"use client";
import React, {useState, useEffect} from 'react'
import { Game } from '@/types'

function Wait({g} : { g : Game }) {
    const [game, setGame] = useState<Game>();

    useEffect(() => {
        setGame(g);
    }, [g]);

  return (
    <div className='mt-6'>
      {game?.state === 'EATRAF' ?
      <h1 className='text-center'>
        Estana {game?.operations.find(op => op.name === 'E3trf')?.player} y3trf l {game.currentPlayer}
        </h1>
        :
        <>
      <h1 className='text-center'>
        Estana {game?.currentPlayer} galo 
        </h1>
        <h2 className='text-center mt-2 text-2xl font-bold'>
          {game?.operations.find(op => op.player === game.currentPlayer)?.name}
        </h2>
        </>
}
        </div>
  )
}

export default Wait