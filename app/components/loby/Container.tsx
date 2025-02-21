'use client'
import React, { useState, useEffect } from 'react'
import Menu from '@/app/components/loby/Menu';
import usePartySocket from 'partysocket/react'
import { Game, GameStates } from '@/types'


function Container({code} : {code: string}) {
    const [game, setGame] = useState<Game>();
    const [name, setName] = useState<string | null>(null);

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
        if (!storedName)
          window.location.href = '/';
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
            return <h1>Game Started</h1>
    }

  return (
    <div>
        <div>
        <h1 className='text-5xl w-fit mx-auto'>LOBY</h1>
        <h2 className='text-md font-normal w-fit mx-auto'>Room Code: {code}</h2>
        </div>
        {render()}
    </div>
  )
}

export default Container