import React from 'react'
import Menu from '@/app/components/loby/Menu';


async function Page({params,} : { params: Promise<{ code: string }>;})
{
  const code = (await params).code;
  const loby = await fetch(`http://localhost:1999/party/${code}`).then(res => res.json());

  console.log(code)
  return (
    <div className='mt-12'>
      <div>
        <h1 className='text-5xl w-fit mx-auto'>LOBY</h1>
        <h2 className='text-md font-normal w-fit mx-auto'>Room Code: {code}</h2>
        </div>
        <div className='w-11/12 mx-auto my-4 bg-foreground p-4 rounded-lg'>
          <h2 className='text-2xl w-fit mx-auto'>Players</h2>
          <ul className='w-11/12 mx-auto my-4'>
            {loby?.players.map((player : string) => (
              <li key={player} className='text-xl font-normal bg-background px-4 py-2 w-fit rounded-lg'>
                <span>{player}</span>
              </li>
            ))}
          </ul>
        </div>
        <hr className='w-1/2 mx-auto my-4 border-2 border-text'/>
        <Menu loby={JSON.parse(JSON.stringify(loby))}/>
    </div>
  )
}

export default Page