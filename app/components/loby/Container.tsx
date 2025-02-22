'use client'
import React, { useState, useEffect } from 'react'
import Menu from '@/app/components/loby/Menu';
import usePartySocket from 'partysocket/react'
import { Game, GameStates } from '@/types'


function Container({code} : {code: string}) {
    const [game, setGame] = useState<Game>();
    const [name, setName] = useState<string>("");

    const socket = usePartySocket({
      host: process.env.NEXT_PUBLIC_PARTY_URL,
      room: code,
      onMessage(msg) {
        console.log(msg);
        if (msg.data === "undefined") {
          window.location.href = '/';
        }
        const data = JSON.parse(msg.data) as Game;
        if (data) {
          setGame(data);
        }
      },
    });

    useEffect(() => {
        const storedName = localStorage.getItem('name');
        if (!storedName){
          window.location.href = '/';
          return;
        }
        setName(storedName); 
        socket.send(JSON.stringify({type: 'join', name: storedName, id: socket.id}));   
      }, [socket]);

      const handleEndGame = async () => {
        socket.send(JSON.stringify({type: 'delete', id: socket.id}));  
      };


    const render = () => {
        if (!game || game.state === GameStates.LOBBY)
            return <Menu game={game} name={name || ""} endGame={handleEndGame} socket={socket} />
        if (game.state === GameStates.STARTED)
            return (<div>
              {game.currentPlayer === name ? <><h1>{
                game.operations.filter(op => op.player === name && !op.done).map(op => (
                    <div key={op.name}>
                        <h2>{op.name}</h2>
                        <p>{op.description}</p>
                        <ul>
                            {op.options.map(option => (
                                <li key={option}>{option}</li>
                            ))}
                        </ul>
                    </div>
                ))
              }</h1> 
              <button onClick={() => socket.send(JSON.stringify({type: 'endTurn', name}))}>End Turn</button>
              </>:
              <h1>Waiting for {game.currentPlayer} to finish</h1>}
            </div>)
    }

  return (
    <div>
        <div>
        <h1 className='text-5xl w-fit mx-auto'>{name}</h1>
        <h2 className='text-md font-normal w-fit mx-auto'>Code: {code}</h2>
        </div>
        {render()}
    </div>
  )
}

export default Container