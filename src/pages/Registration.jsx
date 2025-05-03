import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Registration() {    
  const navigate = useNavigate();

  return (
    <div className='flex flex-col gap-y-6 items-center justify-center min-h-screen'>
      <p>Próximamente se podrá inscribir a los nuevos usuarios en esta página.</p>
      <button 
        className='bg-purple-950 hover:bg-black text-white font-bold py-2 px-4 rounded cursor-pointer'
        onClick={() => navigate('/')}
      >
        Aceptar
      </button>
    </div>
  )
}
