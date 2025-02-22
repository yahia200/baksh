'use client'
import React, { useState, useEffect } from 'react'
import Menu from '@/app/components/loby/Menu';
import usePartySocket from 'partysocket/react'
import { Game, GameStates } from '@/types'
import Operation from './Operation';
import Wait from './Wait';
import { Button } from '@/components/ui/button';


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

      const Info = () => {
        return (
          <div className='mx-auto w-fit text-center mt-6'>
            <h1 className='w-fit mb-2'>Enta {game?.omala.includes(name) ? "3ameel" : "zemeel"}</h1>
            <Button disabled={game?.players.find(p => p.name === name)?.ready} onClick={() => socket.send(JSON.stringify({type: 'ready', id: socket.id}))}>{ game?.players.find(p => p.name === name)?.ready ? "Estana" : "Eshta"}</Button>
          </div>
        )
      }


    const render = () => {
        if (!game || game.state === GameStates.LOBBY)
            return <Menu game={game} name={name || ""} endGame={handleEndGame} socket={socket} />
        else if (game.state === GameStates.INFO)
            return <Info />
        else if (game.state === GameStates.STARTED || game.state === GameStates.EATRAF)
            return (<div>
              {game.currentPlayer === name ? <Operation g={game} name={name} socket={socket}/> : <Wait g={game}/>}
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