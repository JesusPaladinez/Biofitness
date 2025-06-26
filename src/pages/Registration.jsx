import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import { planService } from '../services/planService';
import { paymentMethodService } from '../services/paymentMethodService';
import { managerService } from '../services/managerService';

export default function Registration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name_user: '',
    phone: '',
    id_plan: '',
    id_method: '',
    id_manager: ''
  });
  const [plans, setPlans] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Cargar datos para los selects
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plansData, methodsData, managersData] = await Promise.all([
          planService.getAll(),
          paymentMethodService.getAll(),
          managerService.getAll()
        ]);
        setPlans(plansData);
        setPaymentMethods(methodsData);
        setManagers(managersData);
      } catch (err) {
        setError('Error al cargar los datos');
      }
    };
    fetchData();
  }, []);

  // Calcular precio cuando cambie el plan
  useEffect(() => {
    if (formData.id_plan) {
      const plan = plans.find(p => p.id_plan === parseInt(formData.id_plan));
      setSelectedPlan(plan);
    } else {
      setSelectedPlan(null);
    }
  }, [formData.id_plan, plans]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await userService.createUserWithMembership(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear la inscripción');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4'>
      <div className='bg-white p-8 rounded-2xl border-1 border-gray-300 w-full max-w-md'>
        <h2 className='text-2xl font-semibold text-center mb-6 text-black'>Inscripción</h2>

        {error && (
          <div className='mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded'>
            {error}
          </div>
        )}

        <form className='space-y-4' onSubmit={handleSubmit}>
          <div>
            <label className='block text-gray-500 text-sm mb-2' htmlFor='name_user'>
              Nombre
            </label>
            <input
              type='text'
              id='name_user'
              name='name_user'
              value={formData.name_user}
              onChange={handleInputChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-300'
              required
            />
          </div>

          <div>
            <label className='block text-gray-500 text-sm mb-2' htmlFor='phone'>
              Teléfono
            </label>
            <input
              type='tel'
              id='phone'
              name='phone'
              value={formData.phone}
              onChange={handleInputChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-300'
              placeholder='Ej: 3197612345'
              required
            />
          </div>

          <div>
            <label className='block text-gray-500 text-sm mb-2' htmlFor='id_plan'>
              Plan de días
            </label>
            <select
              id='id_plan'
              name='id_plan'
              value={formData.id_plan}
              onChange={handleInputChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-300'
              required
            >
              <option value='' className='text-gray-500'>Seleccione el plan de días</option>
              {plans.map(plan => (
                <option key={plan.id_plan} value={plan.id_plan}>
                  {plan.days_duration} días - ${plan.price.toLocaleString('es-CO')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className='block text-gray-500 text-sm mb-2' htmlFor='id_method'>
              Método de pago
            </label>
            <select
              id='id_method'
              name='id_method'
              value={formData.id_method}
              onChange={handleInputChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-300'
              required
            >
              <option value='' className='text-gray-500'>Seleccione el método de pago</option>
              {paymentMethods.map(method => (
                <option key={method.id_method} value={method.id_method}>
                  {method.name_method}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className='block text-gray-500 text-sm mb-2' htmlFor='id_manager'>
              Administrador
            </label>
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

          {selectedPlan && (
            <div>
              <label className='block text-gray-500 text-sm mb-2'>
                Total a pagar
              </label>
              <p className='w-full text-lg font-semibold text-purple-800'>
                ${selectedPlan.price.toLocaleString('es-CO')}
              </p>
            </div>
          )}

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
  )
}
