import React, { useEffect, useState } from 'react';
import { managerService } from '../services/managerService';
import { MdEdit } from "react-icons/md";
import { FiChevronLeft } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';

export default function ManagerProfile() {
  const navigate = useNavigate();
  // Obtener manager logueado desde localStorage
  const managerData = JSON.parse(localStorage.getItem('managerData'));
  const id = managerData?.id_manager;
  const [manager, setManager] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name_manager: '',
    phone: '',
    email: ''
  });
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    if (!id) {
      setError('No hay sesión activa.');
      setLoading(false);
      return;
    }
    const fetchManager = async () => {
      try {
        setLoading(true);
        const data = await managerService.getById(id); // id_manager del logueado
        setManager(data);
        setFormData({
          name_manager: data.name_manager || '',
          phone: data.phone || '',
          email: data.email || ''
        });
      } catch (err) {
        setError('Error al cargar los datos del administrador');
      } finally {
        setLoading(false);
      }
    };
    fetchManager();
  }, [id]);

  const handleStartEditing = () => {
    setFormData({
      name_manager: manager.name_manager || '',
      phone: manager.phone || '',
      email: manager.email || ''
    });
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name_manager: manager.name_manager || '',
      phone: manager.phone || '',
      email: manager.email || ''
    });
    setShowPasswordFields(false);
    setPasswordData({ current: '', new: '', confirm: '' });
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      let updateData = {
        name_manager: formData.name_manager,
        phone: formData.phone,
        email: formData.email
      };
      // Si los campos de contraseña están llenos y válidos, incluir password
      if (showPasswordFields && passwordData.new && passwordData.confirm) {
        if (passwordData.new !== passwordData.confirm) {
          setPasswordError('La nueva contraseña y la confirmación no coinciden');
          setLoading(false);
          return;
        }
        if (!passwordData.current) {
          setPasswordError('La contraseña actual es obligatoria');
          setLoading(false);
          return;
        }
        updateData.password = passwordData.new;
        updateData.currentPassword = passwordData.current;
      }
      await managerService.update(id, updateData);
      const updated = await managerService.getById(id);
      setManager(updated);
      setIsEditing(false);
      setShowPasswordFields(false);
      setPasswordData({ current: '', new: '', confirm: '' });
      setPasswordError('');
      setPasswordSuccess('');
      alert('Perfil actualizado exitosamente');
    } catch (err) {
      // Si el error es de contraseña, mostrarlo debajo del campo y no cerrar el form
      const backendError = err?.response?.data?.error || '';
      if (
        backendError === 'La contraseña actual es incorrecta' ||
        backendError === 'La contraseña actual es obligatoria para cambiar la contraseña'
      ) {
        setPasswordError(backendError);
      } else if (backendError === 'La nueva contraseña y la confirmación no coinciden') {
        setPasswordError(backendError);
      } else {
        setError('Error al actualizar el perfil');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    setPasswordError('');
    setPasswordSuccess('');
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

  if (!manager) {
    return (
      <div className="container mx-auto px-8 py-10">
        <div className="text-center">Administrador no encontrado</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-8 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Perfil del Administrador</h1>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1">
              <FiChevronLeft className="text-xl" />
              Volver
            </span>
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name_manager"
                  value={formData.name_manager}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-300"
                />
              ) : (
                <div className="px-3 py-2 bg-gray-50 rounded-md">{manager.name_manager}</div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
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
                <div className="px-3 py-2 bg-gray-50 rounded-md">{manager.phone}</div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Correo electrónico</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-300"
                />
              ) : (
                <div className="px-3 py-2 bg-gray-50 rounded-md">{manager.email}</div>
              )}
            </div>
            {/* Cambiar contraseña */}
            {isEditing && (
              <div className="mt-4 flex flex-col gap-4">
                <p
                  className="text-purple-700 font-semibold cursor-pointer hover:underline w-fit"
                  onClick={() => {
                    setShowPasswordFields(v => !v);
                    setPasswordError('');
                    setPasswordSuccess('');
                  }}
                >
                  Cambiar contraseña
                </p>
                {showPasswordFields && (
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña actual</label>
                      <input
                        type="password"
                        name="current"
                        value={passwordData.current}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-300"
                        autoComplete="current-password"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña nueva</label>
                      <input
                        type="password"
                        name="new"
                        value={passwordData.new}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-300"
                        autoComplete="new-password"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar contraseña</label>
                      <input
                        type="password"
                        name="confirm"
                        value={passwordData.confirm}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-300"
                        autoComplete="new-password"
                      />
                    </div>
                    {passwordError && <p className="text-red-600 text-sm font-medium mt-1">{passwordError}</p>}
                    {passwordSuccess && <div className="text-green-600 text-sm font-medium">{passwordSuccess}</div>}
                  </div>
                )}
              </div>
            )}
          </div>
          {/* Botones de acción */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
            {!isEditing ? (
              <button
                onClick={handleStartEditing}
                className="flex items-center gap-2 bg-purple-200 hover:bg-purple-300 text-purple-800 px-4 py-2 rounded-md font-medium transition-colors cursor-pointer"
              >
                Editar perfil
                <MdEdit />
              </button>
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
                  className="bg-purple-200 hover:bg-purple-300 text-purple-800 px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50 cursor-pointer"
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
}
