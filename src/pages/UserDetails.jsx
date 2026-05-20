import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import { planService } from '../services/planService';
import { paymentMethodService } from '../services/paymentMethodService';
import { MdEdit, MdDelete } from "react-icons/md";
import { FiChevronLeft } from "react-icons/fi";
import { FaCaretDown } from "react-icons/fa";
import toast from 'react-hot-toast';
import { singleToast } from '../utils/singleToast';
import ToasterAlert from '../components/ToasterAlert';
import { optimizeCloudinaryImage } from '../utils/cloudinaryImage';

const UserDetails = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [memberships, setMemberships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [plans, setPlans] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [managers, setManagers] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [amountToPay, setAmountToPay] = useState('');
    const [formData, setFormData] = useState({
        name_user: '',
        phone: '',
        id_plan: '',
        id_method: '',
        id_manager: '',
        receipt_number: ''
    });

    // Obtener manager logueado
    const managerData = JSON.parse(localStorage.getItem('managerData'));
    const loggedManagerId = managerData?.id_manager;
    const loggedManagerName = managerData?.name_manager;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Fetch all data in parallel
                const [userData, membershipsData, plansData, methodsData] = await Promise.all([
                    userService.getById(userId),
                    userService.getMembershipsByUser(userId),
                    planService.getAll(),
                    paymentMethodService.getAll()
                ]);
                
                setUser(userData);
                setMemberships(membershipsData);
                setPlans(plansData);
                setPaymentMethods(methodsData);

                // Get the most recent membership for form data
                const latestMembership = membershipsData.length > 0 ? membershipsData[0] : null;
                
                // Initialize form data with current values
                // Find the plan and method that match the membership data
                const matchingPlan = plansData.find(plan => plan.days_duration === latestMembership?.days_duration);
                const matchingMethod = methodsData.find(method => method.name_method === latestMembership?.name_method);
                
                setFormData({
                    name_user: userData.name_user || '',
                    phone: userData.phone || '',
                    id_plan: matchingPlan ? matchingPlan.id_plan.toString() : '',
                    id_method: matchingMethod ? matchingMethod.id_method.toString() : '',
                    id_manager: latestMembership?.id_manager?.toString() || '',
                    receipt_number: latestMembership?.receipt_number || ''
                });
                // Inicializar monto a pagar desde la membresía (o precio del plan)
                if (matchingPlan) {
                    const initialPay = (latestMembership && typeof latestMembership.pay === 'number') ? latestMembership.pay : matchingPlan.price;
                    setAmountToPay(String(initialPay));
                } else {
                    setAmountToPay('');
                }
            } catch (err) {
                setError('Error al cargar los datos del usuario');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId]);



    // Function to update form data when editing starts
    const handleStartEditing = () => {
        const latestMembership = memberships.length > 0 ? memberships[0] : null;
        
        // Find the plan and method that match the membership data
        const matchingPlan = plans.find(plan => plan.days_duration === latestMembership?.days_duration);
        const matchingMethod = paymentMethods.find(method => method.name_method === latestMembership?.name_method);
        
        // Convert to string to ensure proper comparison with select values
        const formDataToSet = {
            name_user: user.name_user || '',
            phone: user.phone || '',
            id_plan: matchingPlan ? matchingPlan.id_plan.toString() : '',
            id_method: matchingMethod ? matchingMethod.id_method.toString() : '',
            id_manager: latestMembership?.id_manager?.toString() || '',
            receipt_number: latestMembership?.receipt_number || ''
        };
        
        setFormData(formDataToSet);
        // Prefijar amountToPay al entrar en edición
        const initialPay = (latestMembership && typeof latestMembership.pay === 'number') ? latestMembership.pay : (matchingPlan ? matchingPlan.price : 0);
        setAmountToPay(String(initialPay));
        setIsEditing(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCancel = () => {
        setIsEditing(false);
        // Reset form data to original values
        const latestMembership = memberships.length > 0 ? memberships[0] : null;
        
        // Find the plan and method that match the membership data
        const matchingPlan = plans.find(plan => plan.days_duration === latestMembership?.days_duration);
        const matchingMethod = paymentMethods.find(method => method.name_method === latestMembership?.name_method);
        
        setFormData({
            name_user: user.name_user || '',
            phone: user.phone || '',
            id_plan: matchingPlan ? matchingPlan.id_plan.toString() : '',
            id_method: matchingMethod ? matchingMethod.id_method.toString() : '',
            id_manager: latestMembership?.id_manager?.toString() || '',
            receipt_number: latestMembership?.receipt_number || ''
        });
        const resetPay = (latestMembership && typeof latestMembership.pay === 'number') ? latestMembership.pay : (matchingPlan ? matchingPlan.price : 0);
        setAmountToPay(String(resetPay));
    };

    const handleUpdate = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Validación adicional en el frontend
            if (!formData.receipt_number.trim()) {
                setError('El número de recibo es requerido');
                setLoading(false);
                return;
            }
            
            // Solo enviar los campos que realmente necesitamos actualizar
            // Validar pay contra el precio del plan
            const selectedPlan = plans.find(p => p.id_plan.toString() === (formData.id_plan || ''));
            const planPrice = selectedPlan ? selectedPlan.price : 0;
            const parsedPay = amountToPay === '' ? planPrice : parseInt(amountToPay, 10);
            if (isNaN(parsedPay) || parsedPay < 0) {
                setError('El valor de pago es inválido');
                setLoading(false);
                return;
            }
            if (parsedPay > planPrice) {
                setError('El pago no puede ser mayor al precio del plan');
                setLoading(false);
                return;
            }

            const updateData = {
                name_user: formData.name_user,
                phone: formData.phone,
                id_plan: formData.id_plan,
                id_method: formData.id_method,
                receipt_number: formData.receipt_number,
                id_manager: loggedManagerId,
                pay: parsedPay
            };
            
            const response = await userService.updateUserWithMembership(userId, updateData);
            
            // Refresh user and memberships data
            const [userData, membershipsData] = await Promise.all([
                userService.getById(userId),
                userService.getMembershipsByUser(userId)
            ]);
            setUser(userData);
            setMemberships(membershipsData);
            setIsEditing(false);
            singleToast.success('Usuario actualizado exitosamente');
        } catch (err) {
            console.error('=== ERROR DETAILS ===');
            console.error('Full error object:', err);
            console.error('Error response:', err.response);
            console.error('Error response data:', err.response?.data);
            console.error('Error message:', err.message);
            console.error('Error status:', err.response?.status);
            
            const errorMessage = err.response?.data?.error || 'Error al actualizar el usuario';
            setError(errorMessage);
            console.error('Backend error:', err.response?.data || err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        singleToast.dismiss();
        toast((t) => (
            <div className="flex items-center gap-4 text-left">
                <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                    <span>¿Estás seguro de <b>eliminar este usuario</b>?</span>
                    <span className="text-sm">Esta acción no se puede deshacer.</span>
                </div>
                <div className="flex gap-2 shrink-0">
                    <button 
                        onClick={() => {
                            toast.dismiss(t.id);
                            executeDelete();
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors cursor-pointer"
                    >
                        Eliminar
                    </button>
                    <button 
                        onClick={() => toast.dismiss(t.id)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1.5 rounded text-sm font-medium transition-colors cursor-pointer"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        ), {
            duration: 10000,
            className: "bg-white border border-gray-200 rounded-lg shadow-lg !px-3 !py-2 min-w-[510px] max-w-[90vw]"
        });
    };

    const executeDelete = async () => {
        try {
            setLoading(true);
            setError(null);
            
            await userService.deleteUserWithMembership(userId);
            
            singleToast.success('Usuario eliminado exitosamente');
            
            // Redireccionar a la lista de membresías después de eliminar
            navigate('/membresias');
        } catch (err) {
            console.error('Error al eliminar usuario:', err);
            const errorMessage = err.response?.data?.error || 'Error al eliminar el usuario';
            setError(errorMessage);
            singleToast.error(errorMessage);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-8 py-10">
                <div className="text-center">Cargando...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-8 py-10">
                <div className="text-red-500 text-center">{error}</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="container mx-auto px-8 py-10">
                <div className="text-center">Usuario no encontrado</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-8 py-10">
            <ToasterAlert />
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Datos del Usuario</h1>
                    <button
                        onClick={() => navigate('/membresias')}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors cursor-pointer"
                    >
                        <span className="flex items-center gap-1">
                            <FiChevronLeft className="text-xl" />
                            Volver
                        </span>
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Nombre */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nombre
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="name_user"
                                    value={formData.name_user}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-100"
                                />
                            ) : (
                                <div className="px-3 py-2 bg-gray-50 rounded-md">
                                    {user.name_user}
                                </div>
                            )}
                        </div>

                        {/* Foto del rostro */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Foto del rostro
                            </label>
                            {user.face ? (
                                <img
                                    src={optimizeCloudinaryImage(user.face, { width: 256 })}
                                    alt="Rostro del usuario"
                                    className="h-32 w-32 rounded-full object-cover border border-gray-200"
                                    loading="lazy"
                                />
                            ) : (
                                <div className="px-3 py-2 bg-gray-50 rounded-md text-sm text-gray-500">
                                    Sin foto registrada
                                </div>
                            )}
                        </div>

                        {/* Teléfono */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Teléfono
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-100"
                                    placeholder="10 dígitos"
                                />
                            ) : (
                                <div className="px-3 py-2 bg-gray-50 rounded-md">
                                    {user.phone}
                                </div>
                            )}
                        </div>
                        
                        {/* Plan */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Plan
                            </label>
                            {isEditing ? (
                                <div className="relative">
                                    <select
                                        name="id_plan"
                                        value={formData.id_plan || ''}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-100 appearance-none cursor-pointer"
                                    >
                                        {plans.map(plan => (
                                            <option key={plan.id_plan} value={plan.id_plan.toString()}>
                                                {plan.days_duration} {plan.days_duration === 1 ? 'día' : 'días'}
                                            </option>
                                        ))}
                                    </select>
                                    <FaCaretDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                                </div>
                            ) : (
                                <div className="px-3 py-2 bg-gray-50 rounded-md">
                                    {memberships.length > 0 ? (
                                        `${memberships[0].days_duration} ${memberships[0].days_duration === 1 ? 'día' : 'días'}`
                                    ) : (
                                        'Sin membresías'
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Método de Pago */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Método de Pago
                            </label>
                            {isEditing ? (
                                <div className="relative">
                                    <select
                                        name="id_method"
                                        value={formData.id_method || ''}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-100 appearance-none cursor-pointer"
                                    >
                                        {paymentMethods.map(method => (
                                            <option key={method.id_method} value={method.id_method.toString()}>
                                                {method.name_method}
                                            </option>
                                        ))}
                                    </select>
                                    <FaCaretDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                                </div>
                            ) : (
                                <div className="px-3 py-2 bg-gray-50 rounded-md">
                                    {memberships.length > 0 ? memberships[0].name_method : 'Sin membresías'}
                                </div>
                            )}
                        </div>

                        {/* Total a pagar (editable) */}
                        {isEditing && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Total a pagar</label>
                                <input
                                    type="number"
                                    inputMode="numeric"
                                    min={0}
                                    step={100}
                                    value={amountToPay}
                                    onChange={(e) => {
                                        const raw = e.target.value;
                                        const selectedPlan = plans.find(p => p.id_plan.toString() === (formData.id_plan || ''));
                                        const planPrice = selectedPlan ? selectedPlan.price : 0;
                                        if (raw === '') { setAmountToPay(''); return; }
                                        const val = parseInt(raw, 10);
                                        if (isNaN(val)) return;
                                        if (val > planPrice) {
                                            singleToast.error('El total a pagar no puede ser mayor al precio del plan');
                                            setAmountToPay(String(planPrice));
                                        } else if (val < 0) {
                                            setAmountToPay('0');
                                        } else {
                                            setAmountToPay(String(val));
                                        }
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-100"
                                />
                                <div className="mt-1 text-xs text-gray-600">
                                    {(() => {
                                        const selectedPlan = plans.find(p => p.id_plan.toString() === (formData.id_plan || ''));
                                        const planPrice = selectedPlan ? selectedPlan.price : 0;
                                        const payPreview = amountToPay === '' ? planPrice : Math.max(0, Math.min(parseInt(amountToPay || '0', 10) || 0, planPrice));
                                        const owePreview = Math.max(0, planPrice - payPreview);
                                        return `Precio del plan: $${planPrice.toLocaleString('es-CO')} | Pagó: $${payPreview.toLocaleString('es-CO')} | Debe: $${owePreview.toLocaleString('es-CO')}`;
                                    })()}
                                </div>
                            </div>
                        )}

                        {/* Receipt Number */}
                        {isEditing && (
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Número de Recibo</label>
                                <input
                                    type="text"
                                    name="receipt_number"
                                    value={formData.receipt_number}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-100"
                                    required
                                />
                            </div>
                        )}

                        {/* Fechas mostradas solo en lectura según datos actuales */}
                        {!isEditing && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Inscripción</label>
                                    <div className="px-3 py-2 bg-gray-50 rounded-md">{user.created_at}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Último Pago</label>
                                    <div className="px-3 py-2 bg-gray-50 rounded-md">{memberships[0]?.last_payment || ''}</div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Membresía actual */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <h3 className="text-lg font-semibold mb-4">Membresía Actual</h3>
                        {memberships.length > 0 ? (
                            <div className="border border-gray-200 rounded-lg p-4">
                                <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Último Pago</label>
                                        <div className="text-sm">{memberships[0].last_payment}</div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Vencimiento</label>
                                        <div className="text-sm">{memberships[0].expiration_date}</div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                                        <span className={`px-2 py-1 rounded text-sm ${
                                            memberships[0].name_state === 'Vigente' ? 'bg-green-100 text-green-800' :
                                            memberships[0].name_state === 'Por vencer' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {memberships[0].name_state}
                                        </span>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Precio del Plan</label>
                                        <div className="text-sm">${(memberships[0].price || 0).toLocaleString('es-CO')}</div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Pagó</label>
                                        <div className="text-sm">${(memberships[0].pay || 0).toLocaleString('es-CO')}</div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Debe</label>
                                        <div className="text-sm">${(memberships[0].owe || 0).toLocaleString('es-CO')}</div>
                                    </div>
                                    {memberships[0].name_state === 'Vencido' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Días en Mora</label>
                                            <div className="text-sm font-semibold text-red-600">{memberships[0].days_arrears}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-4 text-gray-500">Este usuario no tiene membresía registrada</div>
                        )}
                    </div>

                    {/* Botones de acción */}
                    <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
                        {!isEditing ? (
                            <>
                                <button
                                    onClick={handleStartEditing}
                                    className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-md font-medium transition-colors cursor-pointer"
                                >
                                    Editar
                                    <MdEdit />
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-md font-medium transition-colors cursor-pointer"
                                >
                                    Eliminar
                                    <MdDelete />
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={handleCancel}
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-md font-medium transition-colors cursor-pointer"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleUpdate}
                                    disabled={loading}
                                    className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50 cursor-pointer"
                                >
                                    {loading ? 'Actualizando...' : 'Actualizar'}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetails; 