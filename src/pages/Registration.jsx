import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Registration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    planDias: '',
    metodoPago: '',
  });

  const [total, setTotal] = useState(0);

  useEffect(() => {
    switch (formData.planDias) {
      case '1':
        setTotal(5000);
        break;
      case '5':
        setTotal(10000);
        break;
      case '15':
        setTotal(30000);
        break;
      case '30':
        setTotal(60000);
        break;
      default:
        setTotal(0);
    }
  }, [formData.planDias]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar los datos al backend
    console.log({ ...formData, total });
    navigate('/');
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4'>
      <div className='bg-white p-8 rounded-xl border-1 border-gray-300 w-full max-w-md'>
        <h2 className='text-2xl font-bold text-center mb-6 text-purple-950'>Inscripción</h2>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-gray-500 text-sm mb-2' htmlFor='nombre'>
              Nombre
            </label>
            <input
              type='text'
              id='nombre'
              name='nombre'
              value={formData.nombre}
              onChange={handleChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-300'
              required
            />
          </div>

          <div>
            <label className='block text-gray-500 text-sm mb-2' htmlFor='telefono'>
              Teléfono
            </label>
            <input
              type='tel'
              id='telefono'
              name='telefono'
              value={formData.telefono}
              onChange={handleChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-300'
              required
            />
          </div>

          <div>
            <label className='block text-gray-500 text-sm mb-2' htmlFor='metodoPago'>
              Método de pago
            </label>
            <select
              id='metodoPago'
              name='metodoPago'
              value={formData.metodoPago}
              onChange={handleChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-300'
              required
            >
              <option value='' className='text-gray-500'>Seleccione el método de pago</option>
              <option value='efectivo'>Efectivo</option>
              <option value='transferencia'>Transferencia</option>
              <option value='tarjeta'>Tarjeta</option>
            </select>
          </div>

          <div>
            <label className='block text-gray-500 text-sm mb-2' htmlFor='planDias'>
              Plan de días
            </label>
            <select
              id='planDias'
              name='planDias'
              value={formData.planDias}
              onChange={handleChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-300'
              required
            >
              <option value='' className='text-gray-500'>Seleccione el plan</option>
              <option value='1'>1 día</option>
              <option value='5'>5 días</option>
              <option value='15'>15 días</option>
              <option value='30'>30 días</option>
            </select>
          </div>

          <div>
            <label className='block text-gray-500 text-sm mb-2'>
              Total a pagar
            </label>
            <p className='w-full'>
              ${total.toLocaleString('es-CL')}
            </p>
          </div>

          <button
            type='submit'
            className='w-full bg-purple-950 hover:bg-black text-white font-bold py-2 px-4 mt-3 rounded-md transition duration-300'
          >
            Aceptar
          </button>
        </form>
      </div>
    </div>
  )
}
