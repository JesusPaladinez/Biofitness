import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import { planService } from '../services/planService';
import { paymentMethodService } from '../services/paymentMethodService';
import { FaCaretDown } from "react-icons/fa";
import toast from 'react-hot-toast';
import ToasterAlert from '../components/ToasterAlert';

export default function RegisterUser() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name_user: '',
    phone: '',
    id_plan: '',
    id_method: '',
    receipt_number: ''
  });
  const [plans, setPlans] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [manager, setManager] = useState(null);
  const [amountToPay, setAmountToPay] = useState('');
  const [isAmountModified, setIsAmountModified] = useState(false);

  // Helpers para que solo haya un toast visible a la vez
  const showErrorToast = (message) => {
    toast.dismiss();
    toast.error(message);
  };

  const showSuccessToast = (message) => {
    toast.dismiss();
    toast.success(message);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plansData, methodsData] = await Promise.all([
          planService.getAll(),
          paymentMethodService.getAll()
        ]);
        setPlans(plansData);
        setPaymentMethods(methodsData);
      } catch (err) {
        showErrorToast('Error al cargar los datos');
      }
    };
    fetchData();
    // Obtener manager logueado
    const managerData = localStorage.getItem('managerData');
    if (managerData) {
      setManager(JSON.parse(managerData));
    }
  }, []);

  useEffect(() => {
    if (formData.id_plan) {
      const plan = plans.find(p => p.id_plan === parseInt(formData.id_plan));
      setSelectedPlan(plan);
      // Autocompletar con el precio del plan al seleccionar
      if (plan) {
        setAmountToPay(String(plan.price));
        setIsAmountModified(false); // Resetear porque se autocompleta
      } else {
        setAmountToPay('');
        setIsAmountModified(false);
      }
    } else {
      setSelectedPlan(null);
      setAmountToPay('');
      setIsAmountModified(false);
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
    try {
      const planPrice = selectedPlan ? selectedPlan.price : 0;
      const pay = Math.max(0, Math.min(parseInt(amountToPay || '0', 10), planPrice));
      await userService.createUserWithMembership({
        ...formData,
        id_manager: manager?.id_manager,
        pay
      });
      showSuccessToast('Usuario registrado exitosamente');
      navigate('/membresias');
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Error al crear la inscripción';
      showErrorToast(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4'>
      <ToasterAlert />
      <div className='bg-white p-8 rounded-2xl border-1 border-gray-300 w-full max-w-md'>
        <h2 className='text-2xl font-semibold text-center mb-6 text-black'>Inscripción de Usuario</h2>
        <form className='space-y-4' onSubmit={handleSubmit}>
          <div>
            <label className='block font-medium text-gray-700 text-sm mb-2' htmlFor='name_user'>
              Nombre
            </label>
            <input
              type='text'
              id='name_user'
              name='name_user'
              value={formData.name_user}
              onChange={handleInputChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-100'
              required
            />
          </div>

          <div>
            <label className='block font-medium text-gray-700 text-sm mb-2' htmlFor='phone'>
              Teléfono
            </label>
            <input
              type='tel'
              id='phone'
              name='phone'
              value={formData.phone}
              onChange={handleInputChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-100'
              required
            />
          </div>

          <div>
            <label className='block font-medium text-gray-700 text-sm mb-2' htmlFor='id_plan'>
              Plan de días
            </label>
            <div className="relative">
              <select
                id='id_plan'
                name='id_plan'
                value={formData.id_plan}
                onChange={handleInputChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-100 appearance-none cursor-pointer'
                required
              >
                <option value='' className='text-gray-500'>Seleccione el plan de días</option>
                {plans.map(plan => (
                  <option key={plan.id_plan} value={plan.id_plan}>
                    {plan.days_duration} {plan.days_duration === 1 ? 'día' : 'días'} - {plan.plan_description}
                  </option>
                ))}
              </select>
              <FaCaretDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
            </div>
          </div>

          <div>
            <label className='block font-medium text-gray-700 text-sm mb-2' htmlFor='id_method'>
              Método de pago
            </label>
            <div className="relative">
              <select
                id='id_method'
                name='id_method'
                value={formData.id_method}
                onChange={handleInputChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-100 appearance-none cursor-pointer'
                required
              >
                <option value='' className='text-gray-500'>Seleccione el método de pago</option>
                {paymentMethods.map(method => (
                  <option key={method.id_method} value={method.id_method}>
                    {method.name_method}
                  </option>
                ))}
              </select>
              <FaCaretDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
            </div>
          </div>

          <div>
            <label className='block font-medium text-gray-700 text-sm mb-2' htmlFor='receipt_number'>
              Número de Recibo
            </label>
            <input
              type='text'
              id='receipt_number'
              name='receipt_number'
              value={formData.receipt_number}
              onChange={handleInputChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-100'
              required
            />
          </div>

          {selectedPlan && (
            <div>
              <label className='block font-medium text-gray-700 text-sm mb-2'>
                Total a pagar
              </label>
              <input
                type='number'
                // inputMode='numeric'
                min={0}
                max={selectedPlan.price}
                step={100}
                value={amountToPay}
                onChange={(e) => {
                  const raw = e.target.value;
                  // Marcar como modificado cuando el usuario cambia el valor
                  setIsAmountModified(true);
                  // permitir vacío temporalmente
                  if (raw === '') { setAmountToPay(''); return; }
                  const val = parseInt(raw, 10);
                  if (isNaN(val)) return;
                  if (val > selectedPlan.price) {
                    showErrorToast('El total a pagar no puede ser mayor al precio del plan');
                    setAmountToPay(String(selectedPlan.price));
                  } else if (val < 0) {
                    setAmountToPay('0');
                  } else {
                    setAmountToPay(String(val));
                  }
                }}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-100'
              />
              {isAmountModified && (
                <div className='mt-4'>
                  <p className='text-xs text-gray-700'>
                    Precio del plan: ${selectedPlan.price.toLocaleString('es-CO')}
                  </p>
                  {(() => {
                    const t = new Date();
                    t.setDate(t.getDate() + 1);
                    const dd = String(t.getDate()).padStart(2, '0');
                    const mm = String(t.getMonth() + 1).padStart(2, '0');
                    const yyyy = t.getFullYear();
                    const tomorrowStr = `${dd}/${mm}/${yyyy}`;
                    return (
                      <p className='mt-2 text-xs text-gray-700'>
                        Plazo máximo para pagar, el día de mañana {tomorrowStr}
                      </p>
                    );
                  })()}
                </div>
              )}
            </div>
          )}

          <div className='flex gap-4 mt-6'>
            <button
              type='button'
              onClick={() => navigate('/membresias')}
              className='flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors cursor-pointer'
            >
              Cancelar
            </button>
            <button
              type='submit'
              disabled={loading}
              className='flex-1 bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium py-2 px-4 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors cursor-pointer'
            >
              {loading ? 'Procesando...' : 'Aceptar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
