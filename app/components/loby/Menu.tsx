'use client'
import { Button } from '@/components/ui/button'
import { ILoby } from '@/models/loby.model'
import React, { useEffect, useState } from 'react'
import { FiLoader } from 'react-icons/fi'


function Menu({ loby }: { loby: ILoby }) {
  const [name, setName] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem('name');
    if (!storedName)
      window.location.href = '/';
    setName(storedName); 
    
  }, []);

  const handleEndGame = async () => {
    setDeleteLoading(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_PARTY_URL}/party/${loby.code}`, {
      method: 'DELETE',
    }).then(res => res.json());

    if (!res.success) {
      console.error(res);
      return;
    }  
    setDeleteLoading(false);
    window.location.href = '/';
  };

  return (
    <div className='w-11/12 flex flex-col items-center mx-auto space-y-4'>
      <Button className='w-11/12'>Start Game</Button>
      {name === loby?.host && (
        <Button className='w-11/12' onClick={handleEndGame}>
          {deleteLoading ? <FiLoader className='animate-spin' /> :
          "End Game"
}
          </Button>
      )}
    </div>
  );
}

export default Menu;