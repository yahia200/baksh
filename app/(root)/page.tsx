import React from 'react'
import Form from '@/app/components/landing/Form'

async function page() {
  const description = `Bikoon fih 4-* 7elween w 2-3 negseen f el le3ba w el hadaf enoko t7beso ai
   7ad men el we7sheen.`

  return (
    <div className='h-screen pt-44 space-y-4'>
      <h1 className='w-fit mx-auto sm:text-8xl xs:text-7xl mb-8'>nagasa</h1>
    <div className='bg-foreground p-4 xs:w-11/12 lg:w-1/2 mx-auto rounded-3xl'>
    <h2 className='text-xl'>Tel3ab ezzay: </h2>
    <p className='text-sm'>{description}</p>
    <Form/>
    </div>
    </div>
  )
}

  export default page