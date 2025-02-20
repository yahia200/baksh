import React from 'react'
import { getLoby } from '@/server/game'

async function Page({params,} : { params: Promise<{ code: string }>;})
{
  const code = (await params).code;
  const loby = await getLoby(code)
  
  console.log(code)
  return (
    <div className='mt-12'>
      <div>
        <h1 className='text-5xl w-fit mx-auto'>LOBY</h1>
        <h2 className='text-md font-normal w-fit mx-auto'>Room Code: {code}</h2>
        </div>
        <hr className='w-1/2 mx-auto my-4 border-2 border-text'/>
    </div>
  )
}

export default Page