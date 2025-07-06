import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { managerService } from '../services/managerService';

export default function Login() {
  const navigate = useNavigate();
  const [managers, setManagers] = useState([]);
  const [formData, setFormData] = useState({
    id_manager: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const data = await managerService.getAll();
        setManagers(data);
      } catch (err) {
        setError('Error al cargar administradores');
      }
    };
    fetchManagers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Suponemos que existe este método en managerService
      await managerService.login({
        id_manager: formData.id_manager,
        password: formData.password
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4'>
      <div className='bg-white p-8 rounded-2xl border-1 border-gray-300 w-full max-w-md'>
        <h2 className='text-2xl font-semibold text-center mb-6 text-black'>Iniciar sesión</h2>
        {error && (
          <div className='mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded'>
            {error}
          </div>
        )}
        <form className='space-y-4' onSubmit={handleSubmit}>
          <div>
            <label className='block text-gray-500 text-sm mb-2' htmlFor='id_manager'>Administrador</label>
            <select
              id='id_manager'
              name='id_manager'
              value={formData.id_manager}
              onChange={handleInputChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-300'
              required
            >
              <option value='' className='text-gray-500'>Seleccione el administrador</option>
              {managers.map(manager => (
                <option key={manager.id_manager} value={manager.id_manager}>
                  {manager.name_manager}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className='block text-gray-500 text-sm mb-2' htmlFor='password'>Contraseña</label>
            <input
              type='password'
              id='password'
              name='password'
              value={formData.password}
              onChange={handleInputChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-300'
              required
            />
          </div>
          <button
            type='submit'
            disabled={loading}
            className='w-full bg-purple-800 text-white py-2 px-4 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors'
          >
            {loading ? 'Procesando...' : 'Aceptar'}
          </button>
        </form>
      </div>
    </div>
  );
}
