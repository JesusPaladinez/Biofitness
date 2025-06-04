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
        { id: 1, noRecibo: '2154', nombre: 'Juan Pérez', telefono: '3001234567', fechaInscripcion: '2025-04-14', ultimoPago: '2025-04-14', metodoPago: 'Efectivo', responsable: 'Cristian Salazar', planDias: 30 },
        { id: 2, noRecibo: '2155', nombre: 'María García', telefono: '3109876543', fechaInscripcion: '2025-04-04', ultimoPago: '2025-04-04', metodoPago: 'Transferencia', responsable: 'Daniel Torres', planDias: 30 },
        { id: 3, noRecibo: '2156', nombre: 'Carlos López', telefono: '3204567891', fechaInscripcion: '2025-03-10', ultimoPago: '2025-03-10', metodoPago: 'Efectivo', responsable: 'Cristian Salazar', planDias: 30 },
        { id: 4, noRecibo: '2157', nombre: 'Ana Martínez', telefono: '3157891234', fechaInscripcion: '2025-04-25', ultimoPago: '2025-04-25', metodoPago: 'Transferencia', responsable: 'Admin', planDias: 15 },
        { id: 5, noRecibo: '2158', nombre: 'Pedro Sánchez', telefono: '3003216549', fechaInscripcion: '2025-04-09', ultimoPago: '2025-04-09', metodoPago: 'Efectivo', responsable: 'Cristian Salazar', planDias: 30 },
        { id: 6, noRecibo: '2159', nombre: 'Laura Torres', telefono: '3106549873', fechaInscripcion: '2025-04-06', ultimoPago: '2025-04-06', metodoPago: 'Transferencia', responsable: 'Admin', planDias: 30 },
        { id: 7, noRecibo: '2160', nombre: 'Roberto Díaz', telefono: '3201472583', fechaInscripcion: '2025-05-01', ultimoPago: '2025-05-01', metodoPago: 'Efectivo', responsable: 'Admin', planDias: 15 },
        { id: 8, noRecibo: '2161', nombre: 'Sofía Ruiz', telefono: '3159638527', fechaInscripcion: '2025-03-28', ultimoPago: '2025-03-28', metodoPago: 'Transferencia', responsable: 'Admin', planDias: 30 },
        { id: 9, noRecibo: '2162', nombre: 'Miguel Ángel', telefono: '3008529637', fechaInscripcion: '2025-05-15', ultimoPago: '2025-05-15', metodoPago: 'Efectivo', responsable: 'Admin', planDias: 15 },
        { id: 10, noRecibo: '2163', nombre: 'Isabel Mora', telefono: '3107418529', fechaInscripcion: '2025-05-20', ultimoPago: '2025-05-20', metodoPago: 'Transferencia', responsable: 'Admin', planDias: 15 },
        { id: 11, noRecibo: '2164', nombre: 'Valentina Castro', telefono: '3201597534', fechaInscripcion: '2025-03-01', ultimoPago: '2025-03-01', metodoPago: 'Efectivo', responsable: 'Admin', planDias: 30 },
        { id: 12, noRecibo: '2165', nombre: 'Emilio Herrera', telefono: '3153579514', fechaInscripcion: '2025-04-18', ultimoPago: '2025-04-18', metodoPago: 'Transferencia', responsable: 'Admin', planDias: 30 },
        { id: 13, noRecibo: '2166', nombre: 'Camila Ríos', telefono: '3002583691', fechaInscripcion: '2025-04-10', ultimoPago: '2025-04-10', metodoPago: 'Efectivo', responsable: 'Admin', planDias: 15 },
        { id: 14, noRecibo: '2167', nombre: 'Javier Mendoza', telefono: '3109517538', fechaInscripcion: '2025-03-30', ultimoPago: '2025-03-30', metodoPago: 'Transferencia', responsable: 'Admin', planDias: 30 },
        { id: 15, noRecibo: '2168', nombre: 'Lucía Vargas', telefono: '3207531594', fechaInscripcion: '2025-04-22', ultimoPago: '2025-04-22', metodoPago: 'Efectivo', responsable: 'Admin', planDias: 15 },
        { id: 16, noRecibo: '2169', nombre: 'Andrés Salazar', telefono: '3156543219', fechaInscripcion: '2025-04-07', ultimoPago: '2025-04-07', metodoPago: 'Transferencia', responsable: 'Admin', planDias: 30 },
        { id: 17, noRecibo: '2170', nombre: 'Paula Jiménez', telefono: '3003692581', fechaInscripcion: '2025-04-12', ultimoPago: '2025-04-12', metodoPago: 'Efectivo', responsable: 'Admin', planDias: 30 },
        { id: 18, noRecibo: '2171', nombre: 'Esteban Pardo', telefono: '3101473692', fechaInscripcion: '2025-04-01', ultimoPago: '2025-04-01', metodoPago: 'Transferencia', responsable: 'Admin', planDias: 30 },
        { id: 19, noRecibo: '2172', nombre: 'Gabriela Silva', telefono: '3202581473', fechaInscripcion: '2025-05-10', ultimoPago: '2025-05-10', metodoPago: 'Efectivo', responsable: 'Admin', planDias: 15 },
        { id: 20, noRecibo: '2173', nombre: 'Tomás Ortega', telefono: '3159637412', fechaInscripcion: '2025-04-15', ultimoPago: '2025-04-15', metodoPago: 'Transferencia', responsable: 'Admin', planDias: 30 },
        { id: 21, noRecibo: '2174', nombre: 'Daniela Navarro', telefono: '3008521479', fechaInscripcion: '2025-04-20', ultimoPago: '2025-04-20', metodoPago: 'Efectivo', responsable: 'Admin', planDias: 15 },
        { id: 22, noRecibo: '2175', nombre: 'Fernando Rojas', telefono: '3107419638', fechaInscripcion: '2025-03-25', ultimoPago: '2025-03-25', metodoPago: 'Transferencia', responsable: 'Admin', planDias: 30 },
        { id: 23, noRecibo: '2176', nombre: 'Carolina Vega', telefono: '3209638521', fechaInscripcion: '2025-05-05', ultimoPago: '2025-05-05', metodoPago: 'Efectivo', responsable: 'Admin', planDias: 30 },
        { id: 24, noRecibo: '2177', nombre: 'Ricardo Soto', telefono: '3158529631', fechaInscripcion: '2025-04-28', ultimoPago: '2025-04-28', metodoPago: 'Transferencia', responsable: 'Admin', planDias: 15 },
        { id: 25, noRecibo: '2178', nombre: 'Patricia Flores', telefono: '3001478529', fechaInscripcion: '2025-04-02', ultimoPago: '2025-04-02', metodoPago: 'Efectivo', responsable: 'Admin', planDias: 30 },
        { id: 26, noRecibo: '2179', nombre: 'Alejandro Mora', telefono: '3109631478', fechaInscripcion: '2025-05-12', ultimoPago: '2025-05-12', metodoPago: 'Transferencia', responsable: 'Admin', planDias: 15 },
        { id: 27, noRecibo: '2180', nombre: 'Natalia Paredes', telefono: '3208521479', fechaInscripcion: '2025-04-08', ultimoPago: '2025-04-08', metodoPago: 'Efectivo', responsable: 'Admin', planDias: 30 },
        { id: 28, noRecibo: '2181', nombre: 'Hugo Mendoza', telefono: '3157418529', fechaInscripcion: '2025-03-28', ultimoPago: '2025-03-28', metodoPago: 'Transferencia', responsable: 'Admin', planDias: 30 },
        { id: 29, noRecibo: '2182', nombre: 'Verónica Castro', telefono: '3009637418', fechaInscripcion: '2025-05-11', ultimoPago: '2025-05-11', metodoPago: 'Efectivo', responsable: 'Admin', planDias: 15 },
        { id: 30, noRecibo: '2183', nombre: 'Eduardo Ríos', telefono: '3108529637', fechaInscripcion: '2025-04-05', ultimoPago: '2025-04-05', metodoPago: 'Transferencia', responsable: 'Admin', planDias: 30 },
        { id: 31, noRecibo: '2184', nombre: 'Mariana Torres', telefono: '3207419638', fechaInscripcion: '2025-03-15', ultimoPago: '2025-03-15', metodoPago: 'Efectivo', responsable: 'Admin', planDias: 30 },
        { id: 32, noRecibo: '2185', nombre: 'Felipe Herrera', telefono: '3159638527', fechaInscripcion: '2025-05-25', ultimoPago: '2025-05-25', metodoPago: 'Transferencia', responsable: 'Admin', planDias: 15 },
        { id: 33, noRecibo: '2186', nombre: 'Lorena Silva', telefono: '3008527419', fechaInscripcion: '2025-04-09', ultimoPago: '2025-04-09', metodoPago: 'Efectivo', responsable: 'Admin', planDias: 30 },
        { id: 34, noRecibo: '2187', nombre: 'Rodrigo Vargas', telefono: '3107418529', fechaInscripcion: '2025-04-01', ultimoPago: '2025-04-01', metodoPago: 'Transferencia', responsable: 'Admin', planDias: 30 },
        { id: 35, noRecibo: '2188', nombre: 'Sandra Ortiz', telefono: '3209637418', fechaInscripcion: '2025-05-19', ultimoPago: '2025-05-19', metodoPago: 'Efectivo', responsable: 'Admin', planDias: 15 },
        { id: 36, noRecibo: '2189', nombre: 'Manuel Pardo', telefono: '3158529637', fechaInscripcion: '2025-04-04', ultimoPago: '2025-04-04', metodoPago: 'Transferencia', responsable: 'Admin', planDias: 30 },
        { id: 37, noRecibo: '2190', nombre: 'Beatriz Rojas', telefono: '3007419638', fechaInscripcion: '2025-03-21', ultimoPago: '2025-03-21', metodoPago: 'Efectivo', responsable: 'Admin', planDias: 30 },
        { id: 38, noRecibo: '2191', nombre: 'Alberto Soto', telefono: '3109638527', fechaInscripcion: '2025-06-01', ultimoPago: '2025-06-01', metodoPago: 'Transferencia', responsable: 'Admin', planDias: 15 },
        { id: 39, noRecibo: '2192', nombre: 'Carmen Vega', telefono: '3208527419', fechaInscripcion: '2025-04-06', ultimoPago: '2025-04-06', metodoPago: 'Efectivo', responsable: 'Admin', planDias: 30 },
        { id: 40, noRecibo: '2193', nombre: 'Roberto Flores', telefono: '3157418529', fechaInscripcion: '2025-03-03', ultimoPago: '2025-03-03', metodoPago: 'Transferencia', responsable: 'Admin', planDias: 30 },
        { id: 41, noRecibo: '2194', nombre: 'Diana Mora', telefono: '3009637418', fechaInscripcion: '2025-05-24', ultimoPago: '2025-05-24', metodoPago: 'Efectivo', responsable: 'Admin', planDias: 15 },
        { id: 42, noRecibo: '2195', nombre: 'José Paredes', telefono: '3108529637', fechaInscripcion: '2025-04-07', ultimoPago: '2025-04-07', metodoPago: 'Transferencia', responsable: 'Admin', planDias: 30 },
        { id: 43, noRecibo: '2196', nombre: 'Laura Mendoza', telefono: '3207419638', fechaInscripcion: '2025-04-02', ultimoPago: '2025-04-02', metodoPago: 'Efectivo', responsable: 'Admin', planDias: 30 },
        { id: 44, noRecibo: '2197', nombre: 'Carlos Castro', telefono: '3159638527', fechaInscripcion: '2025-06-07', ultimoPago: '2025-06-07', metodoPago: 'Transferencia', responsable: 'Admin', planDias: 15 },
        { id: 45, noRecibo: '2198', nombre: 'Ana Ríos', telefono: '3008527419', fechaInscripcion: '2025-04-08', ultimoPago: '2025-04-08', metodoPago: 'Efectivo', responsable: 'Admin', planDias: 30 },
        { id: 46, noRecibo: '2199', nombre: 'Pedro Torres', telefono: '3107418529', fechaInscripcion: '2025-03-09', ultimoPago: '2025-03-09', metodoPago: 'Transferencia', responsable: 'Admin', planDias: 30 },
        { id: 47, noRecibo: '2200', nombre: 'María Herrera', telefono: '3209637418', fechaInscripcion: '2025-05-29', ultimoPago: '2025-05-29', metodoPago: 'Efectivo', responsable: 'Admin', planDias: 15 },
        { id: 48, noRecibo: '2201', nombre: 'Juan Silva', telefono: '3158529637', fechaInscripcion: '2025-04-09', ultimoPago: '2025-04-09', metodoPago: 'Transferencia', responsable: 'Admin', planDias: 30 },
        { id: 49, noRecibo: '2202', nombre: 'Sofía Vargas', telefono: '3007419638', fechaInscripcion: '2025-03-30', ultimoPago: '2025-03-30', metodoPago: 'Efectivo', responsable: 'Admin', planDias: 30 },
        { id: 50, noRecibo: '2203', nombre: 'Miguel Ortiz', telefono: '3109638527', fechaInscripcion: '2025-06-13', ultimoPago: '2025-06-13', metodoPago: 'Transferencia', responsable: 'Admin', planDias: 15 },
        { id: 51, noRecibo: '2204', nombre: 'Isabel Pardo', telefono: '3208527419', fechaInscripcion: '2025-04-05', ultimoPago: '2025-04-05', metodoPago: 'Efectivo', responsable: 'Admin', planDias: 30 },
        { id: 52, noRecibo: '2205', nombre: 'Francisco Rojas', telefono: '3157418529', fechaInscripcion: '2025-02-15', ultimoPago: '2025-02-15', metodoPago: 'Transferencia', responsable: 'Admin', planDias: 30 },
        { id: 53, noRecibo: '2206', nombre: 'Lucía Soto', telefono: '3009637418', fechaInscripcion: '2025-06-02', ultimoPago: '2025-06-02', metodoPago: 'Efectivo', responsable: 'Admin', planDias: 15 },
        { id: 54, noRecibo: '2207', nombre: 'Antonio Vega', telefono: '3108529637', fechaInscripcion: '2025-04-06', ultimoPago: '2025-04-06', metodoPago: 'Transferencia', responsable: 'Admin', planDias: 30 },
        { id: 55, noRecibo: '2208', nombre: 'Elena Flores', telefono: '3207419638', fechaInscripcion: '2025-03-03', ultimoPago: '2025-03-03', metodoPago: 'Efectivo', responsable: 'Admin', planDias: 30 },
        { id: 56, noRecibo: '2209', nombre: 'Javier Mora', telefono: '3159638527', fechaInscripcion: '2025-03-18', ultimoPago: '2025-03-18', metodoPago: 'Transferencia', responsable: 'Admin', planDias: 30 },
        { id: 57, noRecibo: '2210', nombre: 'Carmen Paredes', telefono: '3008527419', fechaInscripcion: '2025-05-15', ultimoPago: '2025-05-15', metodoPago: 'Efectivo', responsable: 'Admin', planDias: 15 },
        { id: 58, noRecibo: '2211', nombre: 'Diego Mendoza', telefono: '3107418529', fechaInscripcion: '2025-04-07', ultimoPago: '2025-04-07', metodoPago: 'Transferencia', responsable: 'Admin', planDias: 30 },
        { id: 59, noRecibo: '2212', nombre: 'Rosa Castro', telefono: '3209637418', fechaInscripcion: '2025-03-20', ultimoPago: '2025-03-20', metodoPago: 'Efectivo', responsable: 'Admin', planDias: 30 },
        { id: 60, noRecibo: '2213', nombre: 'Alberto Ríos', telefono: '3158529637', fechaInscripcion: '2025-04-18', ultimoPago: '2025-04-18', metodoPago: 'Transferencia', responsable: 'Admin', planDias: 30 },
        { id: 61, noRecibo: '2214', nombre: 'Sergio Giménez', telefono: '3011223344', fechaInscripcion: '2025-03-15', ultimoPago: '2025-03-15', metodoPago: 'Efectivo', responsable: 'Admin', planDias: 30 },
        { id: 62, noRecibo: '2215', nombre: 'Andrea Fernández', telefono: '3112233445', fechaInscripcion: '2025-05-20', ultimoPago: '2025-05-20', metodoPago: 'Transferencia', responsable: 'Admin', planDias: 15 },
        { id: 63, noRecibo: '2216', nombre: 'David Romero', telefono: '3213344556', fechaInscripcion: '2025-04-01', ultimoPago: '2025-04-01', metodoPago: 'Efectivo', responsable: 'Admin', planDias: 30 },
        { id: 64, noRecibo: '2217', nombre: 'Paola Gómez', telefono: '3164455667', fechaInscripcion: '2025-04-25', ultimoPago: '2025-04-25', metodoPago: 'Transferencia', responsable: 'Admin', planDias: 15 },
        { id: 65, noRecibo: '2218', nombre: 'Jorge Ruiz', telefono: '3005566778', fechaInscripcion: '2025-03-05', ultimoPago: '2025-03-05', metodoPago: 'Efectivo', responsable: 'Admin', planDias: 30 },
        { id: 66, noRecibo: '2219', nombre: 'Valeria Pérez', telefono: '3106677889', fechaInscripcion: '2025-04-18', ultimoPago: '2025-04-18', metodoPago: 'Transferencia', responsable: 'Admin', planDias: 15 },
        { id: 67, noRecibo: '2220', nombre: 'Ricardo Castro', telefono: '3207788990', fechaInscripcion: '2025-05-10', ultimoPago: '2025-05-10', metodoPago: 'Efectivo', responsable: 'Admin', planDias: 30 },
        { id: 68, noRecibo: '2221', nombre: 'Elena Díaz', telefono: '3158899001', fechaInscripcion: '2025-03-22', ultimoPago: '2025-03-22', metodoPago: 'Transferencia', responsable: 'Admin', planDias: 30 },
        { id: 69, noRecibo: '2222', nombre: 'Francisco Torres', telefono: '3009900112', fechaInscripcion: '2025-04-04', ultimoPago: '2025-04-04', metodoPago: 'Efectivo', responsable: 'Admin', planDias: 15 },
        { id: 70, noRecibo: '2223', nombre: 'Sofía Herrera', telefono: '3110112233', fechaInscripcion: '2025-05-25', ultimoPago: '2025-05-25', metodoPago: 'Transferencia', responsable: 'Admin', planDias: 30 }
    ];

    // Procesar los datos - ORDENADOS DE FORMA DESCENDENTE POR ID
    const datosProcesados = datos
        .slice() // Crear una copia del array para no modificar el original
        .sort((a, b) => b.id - a.id) // Ordenar de forma descendente por ID
        .map(item => {
            const fechaInscripcion = formatearFecha(item.fechaInscripcion);
            const ultimoPago = formatearFecha(item.ultimoPago);
            const vence = calcularFechaFin(item.ultimoPago, item.planDias);
            const { estado, diasMora } = calcularEstadoYDiasMora(vence);
            return {
                id: item.id,
                noRecibo: item.noRecibo,
                nombre: item.nombre,
                telefono: item.telefono,
                fechaInscripcion,
                ultimoPago,
                metodoPago: item.metodoPago,
                responsable: item.responsable,
                planDias: item.planDias,
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
            item.telefono.includes(searchTerm);
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
                        placeholder="Buscar por nombre o teléfono..."
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