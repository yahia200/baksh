"use client"
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FiLoader } from 'react-icons/fi'
import { createGame as cg, getGame as gg } from '@/server/game'
import toast from 'react-hot-toast'


function Form() {
    const [loading, setLoading] = useState(false)

    const createGame = async () => {
        setLoading(true)
        const name = (document.getElementById('name') as HTMLInputElement).value
        if (!name) {
            setLoading(false)
            return
        }
        localStorage.setItem('name', name);
        const res = await cg(name);
        if (res.success)
            window.location.href = `/game/${res.code}`
        else
        console.error(res)
        setLoading(false)
      }

    const joinGame = async () => {
        const name = (document.getElementById('name') as HTMLInputElement).value
        if (!name) return
        localStorage.setItem('name', name);
        const code = (document.getElementById('code') as HTMLInputElement).value
        if (!code) return
        const res = await gg(code);
        if (!res.success) {
            toast.error(res.code || '7asal moshkela')
            return
        }
        if (res.players.find((p : {name: string}) => p.name === name)) {
            toast.error('Fih 7ad 3amal join b esmak')
            return
        }
        window.location.href = `/game/${code}`
      }


  return (
    <div>
    <div className='w-full flex gap-4 h-fit mt-6 px-1'>
    <input id='name' className='w-full p-2 bg-background rounded-md col-span-2' placeholder={'Esmak Eh'} />
    <input id='code' className='w-1/3 p-2 bg-background rounded-md col-span-2' placeholder={'Code lw hatjoin'} />
    </div>
    <div className='grid grid-cols-2 gap-4 px-1'>
        <Button className='w-full mt-3' onClick={createGame}>
            {
                loading ?
                <FiLoader className='animate-spin'/> :
            "Ebda2 Game"
            }
</Button>
        <Button className='w-full mt-3' onClick={joinGame}>Ed5ol Game</Button>
        </div>
        </div>
  )
}

export default Form