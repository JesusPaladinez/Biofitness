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

    // Función para calcular la fecha fin basada en el plan (15 o 30 días)
    const calcularFechaFin = (fechaInicio, planDias) => {
        const fecha = new Date(fechaInicio);
        fecha.setDate(fecha.getDate() + (planDias - 1)); // Restamos 1 para que el total sea exactamente el número de días incluyendo el día de inicio
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

    // Datos de ejemplo con todos los campos necesarios
    const datos = [
        { id: 1, nombre: 'Juan Pérez', identificacion: '123456789', telefono: '3001234567', fechaInscripcion: '2025-04-14', ultimoPago: '2025-04-14', planDias: 30 },
        { id: 2, nombre: 'María García', identificacion: '987654321', telefono: '3109876543', fechaInscripcion: '2025-04-04', ultimoPago: '2025-04-04', planDias: 30 },
        { id: 3, nombre: 'Carlos López', identificacion: '456789123', telefono: '3204567891', fechaInscripcion: '2025-03-10', ultimoPago: '2025-03-10', planDias: 30 },
        { id: 4, nombre: 'Ana Martínez', identificacion: '789123456', telefono: '3157891234', fechaInscripcion: '2025-04-25', ultimoPago: '2025-04-25', planDias: 15 },
        { id: 5, nombre: 'Pedro Sánchez', identificacion: '321654987', telefono: '3003216549', fechaInscripcion: '2025-04-09', ultimoPago: '2025-04-09', planDias: 30 },
        { id: 6, nombre: 'Laura Torres', identificacion: '654987321', telefono: '3106549873', fechaInscripcion: '2025-04-06', ultimoPago: '2025-04-06', planDias: 30 },
        { id: 7, nombre: 'Roberto Díaz', identificacion: '147258369', telefono: '3201472583', fechaInscripcion: '2025-05-01', ultimoPago: '2025-05-01', planDias: 15 },
        { id: 8, nombre: 'Sofía Ruiz', identificacion: '963852741', telefono: '3159638527', fechaInscripcion: '2025-03-28', ultimoPago: '2025-03-28', planDias: 30 },
        { id: 9, nombre: 'Miguel Ángel', identificacion: '852963741', telefono: '3008529637', fechaInscripcion: '2025-05-15', ultimoPago: '2025-05-15', planDias: 15 },
        { id: 10, nombre: 'Isabel Mora', identificacion: '741852963', telefono: '3107418529', fechaInscripcion: '2025-05-20', ultimoPago: '2025-05-20', planDias: 15 },
        { id: 11, nombre: 'Valentina Castro', identificacion: '159753486', telefono: '3201597534', fechaInscripcion: '2025-03-01', ultimoPago: '2025-03-01', planDias: 30 },
        { id: 12, nombre: 'Emilio Herrera', identificacion: '357951486', telefono: '3153579514', fechaInscripcion: '2025-04-18', ultimoPago: '2025-04-18', planDias: 30 },
        { id: 13, nombre: 'Camila Ríos', identificacion: '258369147', telefono: '3002583691', fechaInscripcion: '2025-04-10', ultimoPago: '2025-04-10', planDias: 15 },
        { id: 14, nombre: 'Javier Mendoza', identificacion: '951753852', telefono: '3109517538', fechaInscripcion: '2025-03-30', ultimoPago: '2025-03-30', planDias: 30 },
        { id: 15, nombre: 'Lucía Vargas', identificacion: '753159486', telefono: '3207531594', fechaInscripcion: '2025-04-22', ultimoPago: '2025-04-22', planDias: 15 },
        { id: 16, nombre: 'Andrés Salazar', identificacion: '654321987', telefono: '3156543219', fechaInscripcion: '2025-04-07', ultimoPago: '2025-04-07', planDias: 30 },
        { id: 17, nombre: 'Paula Jiménez', identificacion: '369258147', telefono: '3003692581', fechaInscripcion: '2025-04-12', ultimoPago: '2025-04-12', planDias: 30 },
        { id: 18, nombre: 'Esteban Pardo', identificacion: '147369258', telefono: '3101473692', fechaInscripcion: '2025-04-01', ultimoPago: '2025-04-01', planDias: 30 },
        { id: 19, nombre: 'Gabriela Silva', identificacion: '258147369', telefono: '3202581473', fechaInscripcion: '2025-05-10', ultimoPago: '2025-05-10', planDias: 15 },
        { id: 20, nombre: 'Tomás Ortega', identificacion: '963741258', telefono: '3159637412', fechaInscripcion: '2025-04-15', ultimoPago: '2025-04-15', planDias: 30 },
        { id: 21, nombre: 'Daniela Navarro', identificacion: '852147963', telefono: '3008521479', fechaInscripcion: '2025-04-20', ultimoPago: '2025-04-20', planDias: 15 },
        { id: 22, nombre: 'Fernando Rojas', identificacion: '741963852', telefono: '3107419638', fechaInscripcion: '2025-03-25', ultimoPago: '2025-03-25', planDias: 30 },
        { id: 23, nombre: 'Carolina Vega', identificacion: '963852147', telefono: '3209638521', fechaInscripcion: '2025-05-05', ultimoPago: '2025-05-05', planDias: 30 },
        { id: 24, nombre: 'Ricardo Soto', identificacion: '852963147', telefono: '3158529631', fechaInscripcion: '2025-04-28', ultimoPago: '2025-04-28', planDias: 15 },
        { id: 25, nombre: 'Patricia Flores', identificacion: '147852963', telefono: '3001478529', fechaInscripcion: '2025-04-02', ultimoPago: '2025-04-02', planDias: 30 },
        { id: 26, nombre: 'Alejandro Mora', identificacion: '963147852', telefono: '3109631478', fechaInscripcion: '2025-05-12', ultimoPago: '2025-05-12', planDias: 15 },
        { id: 27, nombre: 'Natalia Paredes', identificacion: '852147963', telefono: '3208521479', fechaInscripcion: '2025-04-08', ultimoPago: '2025-04-08', planDias: 30 },
        { id: 28, nombre: 'Hugo Mendoza', identificacion: '741852963', telefono: '3157418529', fechaInscripcion: '2025-03-28', ultimoPago: '2025-03-28', planDias: 30 },
        { id: 29, nombre: 'Verónica Castro', identificacion: '963741852', telefono: '3009637418', fechaInscripcion: '2025-05-11', ultimoPago: '2025-05-11', planDias: 15 },
        { id: 30, nombre: 'Eduardo Ríos', identificacion: '852963741', telefono: '3108529637', fechaInscripcion: '2025-04-05', ultimoPago: '2025-04-05', planDias: 30 },
        { id: 31, nombre: 'Mariana Torres', identificacion: '741963852', telefono: '3207419638', fechaInscripcion: '2025-03-15', ultimoPago: '2025-03-15', planDias: 30 },
        { id: 32, nombre: 'Felipe Herrera', identificacion: '963852741', telefono: '3159638527', fechaInscripcion: '2025-05-25', ultimoPago: '2025-05-25', planDias: 15 },
        { id: 33, nombre: 'Lorena Silva', identificacion: '852741963', telefono: '3008527419', fechaInscripcion: '2025-04-09', ultimoPago: '2025-04-09', planDias: 30 },
        { id: 34, nombre: 'Rodrigo Vargas', identificacion: '741852963', telefono: '3107418529', fechaInscripcion: '2025-04-01', ultimoPago: '2025-04-01', planDias: 30 },
        { id: 35, nombre: 'Sandra Ortiz', identificacion: '963741852', telefono: '3209637418', fechaInscripcion: '2025-05-19', ultimoPago: '2025-05-19', planDias: 15 },
        { id: 36, nombre: 'Manuel Pardo', identificacion: '852963741', telefono: '3158529637', fechaInscripcion: '2025-04-04', ultimoPago: '2025-04-04', planDias: 30 },
        { id: 37, nombre: 'Beatriz Rojas', identificacion: '741963852', telefono: '3007419638', fechaInscripcion: '2025-03-21', ultimoPago: '2025-03-21', planDias: 30 },
        { id: 38, nombre: 'Alberto Soto', identificacion: '963852741', telefono: '3109638527', fechaInscripcion: '2025-06-01', ultimoPago: '2025-06-01', planDias: 15 },
        { id: 39, nombre: 'Carmen Vega', identificacion: '852741963', telefono: '3208527419', fechaInscripcion: '2025-04-06', ultimoPago: '2025-04-06', planDias: 30 },
        { id: 40, nombre: 'Roberto Flores', identificacion: '741852963', telefono: '3157418529', fechaInscripcion: '2025-03-03', ultimoPago: '2025-03-03', planDias: 30 },
        { id: 41, nombre: 'Diana Mora', identificacion: '963741852', telefono: '3009637418', fechaInscripcion: '2025-05-24', ultimoPago: '2025-05-24', planDias: 15 },
        { id: 42, nombre: 'José Paredes', identificacion: '852963741', telefono: '3108529637', fechaInscripcion: '2025-04-07', ultimoPago: '2025-04-07', planDias: 30 },
        { id: 43, nombre: 'Laura Mendoza', identificacion: '741963852', telefono: '3207419638', fechaInscripcion: '2025-04-02', ultimoPago: '2025-04-02', planDias: 30 },
        { id: 44, nombre: 'Carlos Castro', identificacion: '963852741', telefono: '3159638527', fechaInscripcion: '2025-06-07', ultimoPago: '2025-06-07', planDias: 15 },
        { id: 45, nombre: 'Ana Ríos', identificacion: '852741963', telefono: '3008527419', fechaInscripcion: '2025-04-08', ultimoPago: '2025-04-08', planDias: 30 },
        { id: 46, nombre: 'Pedro Torres', identificacion: '741852963', telefono: '3107418529', fechaInscripcion: '2025-03-09', ultimoPago: '2025-03-09', planDias: 30 },
        { id: 47, nombre: 'María Herrera', identificacion: '963741852', telefono: '3209637418', fechaInscripcion: '2025-05-29', ultimoPago: '2025-05-29', planDias: 15 },
        { id: 48, nombre: 'Juan Silva', identificacion: '852963741', telefono: '3158529637', fechaInscripcion: '2025-04-09', ultimoPago: '2025-04-09', planDias: 30 },
        { id: 49, nombre: 'Sofía Vargas', identificacion: '741963852', telefono: '3007419638', fechaInscripcion: '2025-03-30', ultimoPago: '2025-03-30', planDias: 30 },
        { id: 50, nombre: 'Miguel Ortiz', identificacion: '963852741', telefono: '3109638527', fechaInscripcion: '2025-06-13', ultimoPago: '2025-06-13', planDias: 15 },
        { id: 51, nombre: 'Isabel Pardo', identificacion: '852741963', telefono: '3208527419', fechaInscripcion: '2025-04-05', ultimoPago: '2025-04-05', planDias: 30 },
        { id: 52, nombre: 'Francisco Rojas', identificacion: '741852963', telefono: '3157418529', fechaInscripcion: '2025-02-15', ultimoPago: '2025-02-15', planDias: 30 },
        { id: 53, nombre: 'Lucía Soto', identificacion: '963741852', telefono: '3009637418', fechaInscripcion: '2025-06-02', ultimoPago: '2025-06-02', planDias: 15 },
        { id: 54, nombre: 'Antonio Vega', identificacion: '852963741', telefono: '3108529637', fechaInscripcion: '2025-04-06', ultimoPago: '2025-04-06', planDias: 30 },
        { id: 55, nombre: 'Elena Flores', identificacion: '741963852', telefono: '3207419638', fechaInscripcion: '2025-03-03', ultimoPago: '2025-03-03', planDias: 30 },
        { id: 56, nombre: 'Javier Mora', identificacion: '963852741', telefono: '3159638527', fechaInscripcion: '2025-03-18', ultimoPago: '2025-03-18', planDias: 30 },
        { id: 57, nombre: 'Carmen Paredes', identificacion: '852741963', telefono: '3008527419', fechaInscripcion: '2025-05-15', ultimoPago: '2025-05-15', planDias: 15 },
        { id: 58, nombre: 'Diego Mendoza', identificacion: '741852963', telefono: '3107418529', fechaInscripcion: '2025-04-07', ultimoPago: '2025-04-07', planDias: 30 },
        { id: 59, nombre: 'Rosa Castro', identificacion: '963741852', telefono: '3209637418', fechaInscripcion: '2025-03-20', ultimoPago: '2025-03-20', planDias: 30 },
        { id: 60, nombre: ' Alberto Ríos', identificacion: '852963741', telefono: '3158529637', fechaInscripcion: '2025-04-18', ultimoPago: '2025-04-18', planDias: 30 },
        { id: 61, nombre: 'Sergio Giménez', identificacion: '112233445', telefono: '3011223344', fechaInscripcion: '2025-03-15', ultimoPago: '2025-03-15', planDias: 30 }, 
        { id: 62, nombre: 'Andrea Fernández', identificacion: '223344556', telefono: '3112233445', fechaInscripcion: '2025-05-20', ultimoPago: '2025-05-20', planDias: 15 }, 
        { id: 63, nombre: 'David Romero', identificacion: '334455667', telefono: '3213344556', fechaInscripcion: '2025-04-01', ultimoPago: '2025-04-01', planDias: 30 }, 
        { id: 64, nombre: 'Paola Gómez', identificacion: '445566778', telefono: '3164455667', fechaInscripcion: '2025-04-25', ultimoPago: '2025-04-25', planDias: 15 }, 
        { id: 65, nombre: 'Jorge Ruiz', identificacion: '556677889', telefono: '3005566778', fechaInscripcion: '2025-03-05', ultimoPago: '2025-03-05', planDias: 30 }, 
        { id: 66, nombre: 'Valeria Pérez', identificacion: '667788990', telefono: '3106677889', fechaInscripcion: '2025-04-18', ultimoPago: '2025-04-18', planDias: 15 }, 
        { id: 67, nombre: 'Ricardo Castro', identificacion: '778899001', telefono: '3207788990', fechaInscripcion: '2025-05-10', ultimoPago: '2025-05-10', planDias: 30 }, 
        { id: 68, nombre: 'Elena Díaz', identificacion: '889900112', telefono: '3158899001', fechaInscripcion: '2025-03-22', ultimoPago: '2025-03-22', planDias: 30 }, 
        { id: 69, nombre: 'Francisco Torres', identificacion: '990011223', telefono: '3009900112', fechaInscripcion: '2025-04-04', ultimoPago: '2025-04-04', planDias: 15 }, 
        { id: 70, nombre: 'Sofía Herrera', identificacion: '101122334', telefono: '3110112233', fechaInscripcion: '2025-05-25', ultimoPago: '2025-05-25', planDias: 30 }, 
        { id: 71, nombre: 'Diego Silva', identificacion: '112233445', telefono: '3211122334', fechaInscripcion: '2025-03-01', ultimoPago: '2025-03-01', planDias: 30 }, 
        { id: 72, nombre: 'Paula Vargas', identificacion: '223344556', telefono: '3162233445', fechaInscripcion: '2025-04-28', ultimoPago: '2025-04-28', planDias: 15 }, 
        { id: 73, nombre: 'Esteban Ortiz', identificacion: '334455667', telefono: '3003344556', fechaInscripcion: '2025-04-07', ultimoPago: '2025-04-07', planDias: 30 }, 
        { id: 74, nombre: 'Gabriela Pardo', identificacion: '445566778', telefono: '3104455667', fechaInscripcion: '2025-03-10', ultimoPago: '2025-03-10', planDias: 15 }, 
    ];

    // Procesar los datos - ORDENADOS DE FORMA DESCENDENTE POR ID
    const datosProcesados = datos
        .slice() // Crear una copia del array para no modificar el original
        .sort((a, b) => b.id - a.id) // Ordenar de forma descendente por ID
        .map(item => {
            const fechaInscripcion = formatearFecha(item.fechaInscripcion);
            const ultimoPago = fechaInscripcion; // Mismo valor que fechaInscripcion
            const vence = calcularFechaFin(item.ultimoPago, item.planDias);
            const { estado, diasMora } = calcularEstadoYDiasMora(vence);
            return {
                id: item.id,
                nombre: item.nombre,
                identificacion: item.identificacion,
                telefono: item.telefono,
                fechaInscripcion,
                ultimoPago,
                planDias: item.planDias, // 15 o 30 días
                vence,
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
        <div className="container mx-auto px-8 py-10" >
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Control de Membresías</h1>
                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        placeholder="Buscar por nombre o identificación..."
                        className="w-80 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                        className="group bg-purple-950 hover:bg-black text-white hover:text-white font-bold py-2 px-4 rounded-lg transition-colors cursor-pointer"
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
        </div >
    );
};

export default Home;