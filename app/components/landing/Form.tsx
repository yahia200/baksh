"use client"
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { createLoby } from '@/server/game'
import { FiLoader } from 'react-icons/fi'


function Form() {
    const [loading, setLoading] = useState(false)

    const createGame = async () => {
        setLoading(true)
        const name = (document.getElementById('name') as HTMLInputElement).value
        if (!name) return
        const loby = await createLoby(name)
        console.log(loby)
        setLoading(false)
      }

      
  return (
    <div>
    <div className='w-full flex gap-4 h-fit mt-6 px-1'>
    <input id='name' className='w-full p-2 bg-background rounded-md col-span-2' placeholder={'Esmak Eh'} />
    </div>
    <div className='grid grid-cols-2 gap-4 px-1'>
        <Button className='w-full mt-3' onClick={createGame}>
            {
                loading ?
                <FiLoader className='animate-spin'/> :
            "Ebda2 Game"
            }
</Button>
        <Button className='w-full mt-3'>Ed5ol Game</Button>
        </div>
        </div>
  )
}

export default Form