import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CgMenuRight } from "react-icons/cg";
import Dropdown from './Dropdown';
import { FaUserGroup } from "react-icons/fa6";
import { LuLogOut } from "react-icons/lu";
import { FaUserCircle } from "react-icons/fa";

const Nav = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Obtener el nombre del manager logueado
    let managerName = 'Iniciado';
    try {
      const managerData = JSON.parse(localStorage.getItem('managerData'));
      if (managerData && managerData.name_manager) {
        managerName = managerData.name_manager;
      }
    } catch (e) {}

    const handleHome = () => {
        navigate('/membresias')
    }

    const handleProfile = () => {
        navigate('/perfil-administrador/1');
        setMenuOpen(false);
    };

    const handleManagers = () => {
        navigate('/administradores');
        setMenuOpen(false);
    };

    const handleLogout = () => {
        // Limpiar el token y datos del manager
        localStorage.removeItem('managerToken');
        localStorage.removeItem('managerData');
        navigate('/');
        setMenuOpen(false);
    };

    // Mostrar solo el logo en la página de login
    if (location.pathname === '/') {
      return (
        <nav className="bg-black w-full py-8 px-16">
            <div className="container mx-auto flex items-center justify-between">
                <img 
                    src="/LogoOrchidGym.png" 
                    className='h-10 cursor-pointer'
                    onClick={handleHome}
                />
            </div>
        </nav>
      );
    }

    // En las demás páginas, mostrar nombre y dropdown
    return (
        <nav className="bg-black w-full py-8 px-16">
            <div className="container mx-auto flex items-center justify-between">
                <img 
                    src="/LogoOrchidGym.png" 
                    className='h-10 cursor-pointer'
                    onClick={handleHome}
                />
                <div className='flex items-center gap-10 relative'>
                    <p className='text-white text-2xl font-medium'>{managerName}</p>
                    <div>
                        <CgMenuRight
                            className='text-white text-2xl cursor-pointer'
                            onClick={() => setMenuOpen((open) => !open)}
                        />
                        <Dropdown open={menuOpen} onClose={() => setMenuOpen(false)}>
                            <button
                                className="flex items-center gap-2 w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-100 cursor-pointer"
                                onClick={handleProfile}
                            >
                                <FaUserCircle />
                                Perfil
                            </button>
                            <button
                                className="flex items-center gap-2 w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-100 cursor-pointer"
                                onClick={handleManagers}
                            >
                                <FaUserGroup />
                                Administradores
                            </button>
                            <button
                                className="flex items-center gap-2 w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-100 cursor-pointer"
                                onClick={handleLogout}
                            >
                                <LuLogOut />
                                Cerrar sesión
                            </button>
                        </Dropdown>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Nav; 