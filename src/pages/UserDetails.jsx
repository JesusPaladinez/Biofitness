import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import { planService } from '../services/planService';
import { paymentMethodService } from '../services/paymentMethodService';

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
    const [formData, setFormData] = useState({
        name_user: '',
        phone: '',
        id_plan: '',
        id_method: '',
        id_manager: ''
    });

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
                    id_manager: latestMembership?.id_manager?.toString() || ''
                });
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
            id_manager: latestMembership?.id_manager?.toString() || ''
        };
        
        setFormData(formDataToSet);
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
            id_manager: latestMembership?.id_manager?.toString() || ''
        });
    };

    const handleUpdate = async () => {
        try {
            setLoading(true);
            
            // Solo enviar los campos que realmente necesitamos actualizar
            const updateData = {
                name_user: formData.name_user,
                phone: formData.phone,
                id_plan: formData.id_plan,
                id_method: formData.id_method
                // No enviamos id_manager para mantener el actual
            };
            
            await userService.updateUserWithMembership(userId, updateData);
            
            // Refresh user and memberships data
            const [userData, membershipsData] = await Promise.all([
                userService.getById(userId),
                userService.getMembershipsByUser(userId)
            ]);
            setUser(userData);
            setMemberships(membershipsData);
            setIsEditing(false);
            
            alert('Usuario actualizado exitosamente');
        } catch (err) {
            setError('Error al actualizar el usuario');
            console.error(err);
        } finally {
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
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Detalles del Usuario</h1>
                    <button
                        onClick={() => navigate('/membresias')}
                        className="text-gray-600 hover:text-gray-800 cursor-pointer"
                    >
                        ← Volver
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-300"
                                />
                            ) : (
                                <div className="px-3 py-2 bg-gray-50 rounded-md">
                                    {user.name_user}
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-300"
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
                                <select
                                    name="id_plan"
                                    value={formData.id_plan || ''}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-300"
                                >
                                    {plans.map(plan => (
                                        <option key={plan.id_plan} value={plan.id_plan.toString()}>
                                            {plan.days_duration} {plan.days_duration === 1 ? 'día' : 'días'}
                                        </option>
                                    ))}
                                </select>
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
                                <select
                                    name="id_method"
                                    value={formData.id_method || ''}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-300"
                                >
                                    {paymentMethods.map(method => (
                                        <option key={method.id_method} value={method.id_method.toString()}>
                                            {method.name_method}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <div className="px-3 py-2 bg-gray-50 rounded-md">
                                    {memberships.length > 0 ? memberships[0].name_method : 'Sin membresías'}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Información de todas las membresías */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <h3 className="text-lg font-semibold mb-4">Historial de la Membresía</h3>
                        {memberships.length > 0 ? (
                            <div className="space-y-4">
                                {memberships.map((membership, index) => (
                                    <div key={membership.id_membership} className="border border-gray-200 rounded-lg p-4">
                                        <div className={`grid gap-4 ${membership.name_state === 'Vencido' ? 'grid-cols-1 md:grid-cols-4' : 'grid-cols-1 md:grid-cols-3'}`}>                                                                                    
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Último Pago
                                                </label>
                                                <div className="text-sm">{membership.last_payment}</div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Fecha de Expiración
                                                </label>
                                                <div className="text-sm">{membership.expiration_date}</div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Estado
                                                </label>
                                                <span className={`px-2 py-1 rounded text-sm ${
                                                    membership.name_state === 'Vigente' ? 'bg-green-100 text-green-800' :
                                                    membership.name_state === 'Por vencer' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {membership.name_state}
                                                </span>
                                            </div>
                                            {membership.name_state === 'Vencido' && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Días en Mora
                                                    </label>
                                                    <div className="text-sm font-semibold text-red-600">
                                                        {membership.days_arrears}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-4 text-gray-500">
                                Este usuario no tiene membresías registradas
                            </div>
                        )}
                    </div>

                    {/* Botones de acción */}
                    <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
                        {!isEditing ? (
                            <button
                                onClick={handleStartEditing}
                                className="bg-purple-800 hover:bg-purple-900 text-white px-6 py-2 rounded-md font-medium transition-colors"
                            >
                                Editar
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={handleCancel}
                                    className="bg-gray-200 hover:bg-gray-300 text-black px-6 py-2 rounded-md font-medium transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleUpdate}
                                    disabled={loading}
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
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