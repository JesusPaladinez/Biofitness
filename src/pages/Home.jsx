import React, { useState } from 'react';
import Table from '../components/Table';
import { GoArrowRight } from "react-icons/go";
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [estadoFilter, setEstadoFilter] = useState('todos');
    const navigate = useNavigate();

    // Función para formatear la fecha al formato dd/mm/yyyy
    const formatearFecha = (fecha) => {
        const date = new Date(fecha);
        const dia = date.getDate();
        const mes = (date.getMonth() + 1).toString().padStart(2, '0');
        const año = date.getFullYear();
        return `${dia}/${mes}/${año}`;
    };

    // Función para calcular la fecha fin (30 días después del inicio, contando el inicio como día 1)
    const calcularFechaFin = (fechaInicio) => {
        const fecha = new Date(fechaInicio);
        fecha.setDate(fecha.getDate() + 29); // Sumamos 29 días para que el total sea 30 días incluyendo el día de inicio
        return formatearFecha(fecha);
    };

    // Función para calcular el estado y días de mora
    const calcularEstadoYDiasMora = (fechaFin) => {
        const fechaActual = new Date();
        const [dia, mes, año] = fechaFin.split('/');
        const fin = new Date(año, mes - 1, dia);
        const diferenciaDias = Math.floor((fechaActual - fin) / (1000 * 60 * 60 * 24));

        if (diferenciaDias > 0) {
            return { estado: 'Vencido', diasMora: diferenciaDias };
        } else if (diferenciaDias >= -5) {
            return { estado: 'Por vencer', diasMora: "" };
        } else {
            return { estado: 'Vigente', diasMora: "" };
        }
    };

    // Función para eliminar tildes/acentos de un string
    const quitarTildes = (texto) =>
        texto.normalize('NFD').replace(/\p{Diacritic}/gu, '');

    // Datos de ejemplo
    const datos = [
        {
            id: 1,
            nombre: 'Juan Pérez',
            identificacion: '123456789',
            inicio: '2025-04-14', // Vigente
        },
        {
            id: 2,
            nombre: 'María García',
            identificacion: '987654321',
            inicio: '2025-04-02', // Por vencer (vencerá el 2/05/2025)
        },
        {
            id: 3,
            nombre: 'Carlos López',
            identificacion: '456789123',
            inicio: '2024-12-31', // Vencido
        },
        {
            id: 4,
            nombre: 'Ana Martínez',
            identificacion: '789123456',
            inicio: '2025-04-25', // Vigente
        },
        {
            id: 5,
            nombre: 'Pedro Sánchez',
            identificacion: '321654987',
            inicio: '2025-04-08', // Vigente (vencerá el 8/05/2025)
        },
        {
            id: 6,
            nombre: 'Laura Torres',
            identificacion: '654987321',
            inicio: '2025-04-01', // Por vencer (vencerá el 1/05/2025)
        },
        {
            id: 7,
            nombre: 'Roberto Díaz',
            identificacion: '147258369',
            inicio: '2025-05-01', // Vigente
        },
        {
            id: 8,
            nombre: 'Sofía Ruiz',
            identificacion: '963852741',
            inicio: '2025-04-05', // Vencido
        },
        {
            id: 9,
            nombre: 'Miguel Ángel',
            identificacion: '852963741',
            inicio: '2025-05-15', // Vigente
        },
        {
            id: 10,
            nombre: 'Isabel Mora',
            identificacion: '741852963',
            inicio: '2025-05-20', // Vigente
        }
    ];

    // Procesar los datos
    const datosProcesados = datos.map(item => {
        const inicio = formatearFecha(item.inicio);
        const fin = calcularFechaFin(item.inicio);
        const { estado, diasMora } = calcularEstadoYDiasMora(fin);
        return {
            ...item,
            inicio,
            fin,
            estado,
            diasMora
        };
    });

    // Filtrar datos según el término de búsqueda y el estado
    const datosFiltrados = datosProcesados.filter(item => {
        const nombreSinTildes = quitarTildes(item.nombre.toLowerCase());
        const searchSinTildes = quitarTildes(searchTerm.toLowerCase());
        const matchesSearch = nombreSinTildes.includes(searchSinTildes) ||
            item.identificacion.includes(searchTerm);
        const matchesEstado = estadoFilter === 'todos' || item.estado === estadoFilter;
        return matchesSearch && matchesEstado;
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Control de Membresías</h1>
                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        placeholder="Buscar por nombre o identificación..."
                        className="w-80 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                        className="group bg-yellow-400 hover:bg-black text-black hover:text-white font-bold py-2 px-4 rounded-lg transition-colors cursor-pointer"
                        onClick={() => navigate('/registration')}
                    >
                        <span className="flex items-center gap-2">
                            Inscribir
                            <GoArrowRight className="hidden group-hover:inline text-2xl" />
                        </span>
                    </button>
                </div>
            </div>
            <Table
                data={datosFiltrados}
                onEstadoFilterChange={setEstadoFilter}
            />
        </div>
    );
};

export default Home; 