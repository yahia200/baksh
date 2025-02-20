"use client"
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FiLoader } from 'react-icons/fi'
import { createGame as cg} from '@/server/game'


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
            window.location.href = `/wait/${res.code}`
        else
        console.error(res)
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