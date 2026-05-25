import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import { planService } from '../services/planService';
import { paymentMethodService } from '../services/paymentMethodService';
import { FaCaretDown } from "react-icons/fa";
import { singleToast } from '../utils/singleToast';
import ToasterAlert from '../components/ToasterAlert';

export default function RegisterUser() {
  const navigate = useNavigate();
  const captureInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [formData, setFormData] = useState({
    name_user: '',
    phone: '',
    id_plan: '',
    id_method: '',
    receipt_number: '',
    enrollment_date: '',
    last_payment_date: ''
  });
  const [plans, setPlans] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [manager, setManager] = useState(null);
  const [amountToPay, setAmountToPay] = useState('');
  const [isAmountModified, setIsAmountModified] = useState(false);

  const [faceFile, setFaceFile] = useState(null);
  const [facePreview, setFacePreview] = useState(null);
  const [webcamOpen, setWebcamOpen] = useState(false);

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
        singleToast.error('Error al cargar los datos');
      }
    };
    fetchData();
    const managerData = localStorage.getItem('managerData');
    if (managerData) {
      setManager(JSON.parse(managerData));
    }
  }, []);

  useEffect(() => {
    return () => {
      if (facePreview) URL.revokeObjectURL(facePreview);
    };
  }, [facePreview]);

  useEffect(() => {
    if (formData.id_plan) {
      const plan = plans.find(p => p.id_plan === parseInt(formData.id_plan));
      setSelectedPlan(plan);
      if (plan) {
        setAmountToPay(String(plan.price));
        setIsAmountModified(false);
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

  useEffect(() => {
    if (!webcamOpen || !videoRef.current || !streamRef.current) return;
    const video = videoRef.current;
    video.srcObject = streamRef.current;
    video.play().catch(() => {});
  }, [webcamOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const setFaceFromFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      singleToast.error('Selecciona un archivo de imagen');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      singleToast.error('La imagen no puede superar 5 MB');
      return;
    }
    setFaceFile(file);
    setFacePreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  };

  const handleCaptureFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setFaceFromFile(file);
    e.target.value = '';
  };

  const clearFace = () => {
    setFaceFile(null);
    setFacePreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  };

  const stopWebcam = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setWebcamOpen(false);
  };

  const openWebcam = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      singleToast.error('Tu navegador no permite usar la cámara web desde aquí');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      });
      streamRef.current = stream;
      setWebcamOpen(true);
    } catch {
      singleToast.error('No se pudo acceder a la cámara');
    }
  };

  const captureFromWebcam = () => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0) {
      singleToast.error('Espera a que la cámara esté lista');
      return;
    }
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          singleToast.error('No se pudo capturar la imagen');
          return;
        }
        const file = new File([blob], 'face.jpg', { type: 'image/jpeg' });
        setFaceFromFile(file);
        stopWebcam();
      },
      'image/jpeg',
      0.92
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const planPrice = selectedPlan ? selectedPlan.price : 0;
      const pay = Math.max(0, Math.min(parseInt(amountToPay || '0', 10), planPrice));

      const today = new Date();
      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const enrollmentDate = formData.enrollment_date && formData.enrollment_date.trim() !== '' ? formData.enrollment_date : formatDate(today);
      const lastPaymentDate = formData.last_payment_date && formData.last_payment_date.trim() !== '' ? formData.last_payment_date : formatDate(today);

      const fd = new FormData();
      fd.append('name_user', formData.name_user);
      fd.append('phone', formData.phone);
      fd.append('id_plan', String(formData.id_plan));
      fd.append('id_method', String(formData.id_method));
      fd.append('receipt_number', formData.receipt_number);
      fd.append('id_manager', String(manager?.id_manager ?? ''));
      fd.append('pay', String(pay));
      fd.append('enrollment_date', enrollmentDate);
      fd.append('last_payment_date', lastPaymentDate);
      if (faceFile) {
        fd.append('face', faceFile);
      }

      await userService.createUserWithMembership(fd);
      singleToast.success('Usuario registrado exitosamente');
      navigate('/membresias');
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Error al crear la inscripción';
      singleToast.error(errorMessage);
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

          <div>
            <label className='block font-medium text-gray-700 text-sm mb-2' htmlFor='enrollment_date'>
              Fecha de inscripción
            </label>
            <input
              type='date'
              id='enrollment_date'
              name='enrollment_date'
              value={formData.enrollment_date}
              onChange={handleInputChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-100'
            />
          </div>

          <div>
            <label className='block font-medium text-gray-700 text-sm mb-2' htmlFor='last_payment_date'>
              Último pago
            </label>
            <input
              type='date'
              id='last_payment_date'
              name='last_payment_date'
              value={formData.last_payment_date}
              onChange={handleInputChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-100'
            />
          </div>

          {selectedPlan && (
            <div>
              <label className='block font-medium text-gray-700 text-sm mb-2'>
                Total a pagar
              </label>
              {selectedPlan.days_duration === 1 ? (
                <p className='w-full py-1 text-gray-800'>
                  ${selectedPlan.price.toLocaleString('es-CO')}
                </p>
              ) : (
                <input
                  type='number'
                  min={0}
                  max={selectedPlan.price}
                  step={100}
                  value={amountToPay}
                  onChange={(e) => {
                    const raw = e.target.value;
                    setIsAmountModified(true);
                    if (raw === '') { setAmountToPay(''); return; }
                    const val = parseInt(raw, 10);
                    if (isNaN(val)) return;
                    if (val > selectedPlan.price) {
                      singleToast.error('El total a pagar no puede ser mayor al precio del plan');
                      setAmountToPay(String(selectedPlan.price));
                    } else if (val < 0) {
                      setAmountToPay('0');
                    } else {
                      setAmountToPay(String(val));
                    }
                  }}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-100'
                />
              )}
              {selectedPlan.days_duration !== 1 && isAmountModified && (
                <div className='mt-4'>
                  <p className='text-xs text-gray-700'>
                    Precio del plan: ${selectedPlan.price.toLocaleString('es-CO')}
                  </p>
                  <p className='mt-2 text-xs text-gray-700'>
                    Queda debiendo: ${Math.max(0, selectedPlan.price - Math.max(0, Math.min(parseInt(amountToPay || '0', 10) || 0, selectedPlan.price))).toLocaleString('es-CO')}
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

          <div>
            <span className='block font-medium text-gray-700 text-sm mb-2' id='face-label'>
              Foto del rostro 
            </span>
            <input
              ref={captureInputRef}
              type='file'
              accept='image/*'
              capture='user'
              className='hidden'
              aria-hidden
              onChange={handleCaptureFileChange}
            />
            <div className='flex flex-wrap gap-2'>
              <button
                type='button'
                onClick={openWebcam}
                className='px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm font-medium transition-colors cursor-pointer'
              >
                Abrir cámara
              </button>
              {facePreview && (
                <button
                  type='button'
                  onClick={clearFace}
                  className='px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm cursor-pointer'
                >
                  Quitar foto
                </button>
              )}
            </div>
            {facePreview && (
              <div className='mt-3'>
                <img
                  src={facePreview}
                  alt='Vista previa del rostro'
                  className='max-h-40 rounded-lg border border-gray-200 object-cover'
                />
              </div>
            )}
          </div>

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

      {webcamOpen && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'
          role='dialog'
          aria-modal='true'
          aria-labelledby='webcam-title'
        >
          <div className='bg-white rounded-xl p-4 max-w-lg w-full shadow-lg'>
            <h3 id='webcam-title' className='text-lg font-semibold mb-3 text-gray-900'>
              Cámara web
            </h3>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className='w-full rounded-lg bg-black aspect-video object-cover'
            />
            <div className='flex gap-2 mt-4 justify-end'>
              <button
                type='button'
                onClick={stopWebcam}
                className='px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm cursor-pointer'
              >
                Cancelar
              </button>
              <button
                type='button'
                onClick={captureFromWebcam}
                className='px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 rounded-lg text-sm font-medium cursor-pointer'
              >
                Capturar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
