import React from 'react'

export default function Footer() {
  return (
    <div className="bg-black text-white py-4">
      <div className="container mx-auto px-4">
        <p className="text-center">
          &copy; {new Date().getFullYear()} Biofitness. Todos los derechos reservados.
        </p>
      </div>
    </div>
  )
}
