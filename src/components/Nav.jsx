import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CgMenuRight } from "react-icons/cg";
import Dropdown from './Dropdown';
import { FaUserGroup } from "react-icons/fa6";
import { LuLogOut } from "react-icons/lu";

const Nav = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        // Aquí puedes limpiar el token o estado de autenticación
        // y redirigir al login si lo deseas
        navigate('/');
    };

    return (
        <nav className="bg-black w-full py-8 px-16">
            <div className="container mx-auto flex items-center justify-between">
                <img 
                    src="/LogoOrchidGym.png" 
                    className='h-10'
                />
                <div className='flex items-center gap-10 relative'>
                    <p className='text-white text-2xl font-medium'>Fernando Sánchez</p>
                    <div>
                        <CgMenuRight
                            className='text-white text-2xl cursor-pointer'
                            onClick={() => setMenuOpen((open) => !open)}
                        />
                        <Dropdown open={menuOpen} onClose={() => setMenuOpen(false)}>
                            <button
                                className="flex items-center gap-2 w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-100 cursor-pointer"
                                onClick={() => {/* lógica para ir a administradores */}}
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