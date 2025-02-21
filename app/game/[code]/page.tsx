import React from 'react'
import Container from '@/app/components/loby/Container';


async function Page({params,} : { params: Promise<{ code: string }>;})
{
  const code = (await params).code;

  console.log(code)
  return (
    <div className='mt-12'>
      <Container code={code}/>
    </div>
  )
}

export default Page