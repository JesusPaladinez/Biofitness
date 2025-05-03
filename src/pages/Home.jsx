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
        { id: 1, nombre: 'Juan Pérez', identificacion: '123456789', inicio: '2025-04-14' }, // Vigente
        { id: 2, nombre: 'María García', identificacion: '987654321', inicio: '2025-04-04' }, // Por vencer
        { id: 3, nombre: 'Carlos López', identificacion: '456789123', inicio: '2025-03-10' }, // Vencido
        { id: 4, nombre: 'Ana Martínez', identificacion: '789123456', inicio: '2025-04-25' }, // Vigente
        { id: 5, nombre: 'Pedro Sánchez', identificacion: '321654987', inicio: '2025-04-09' }, // Por vencer
        { id: 6, nombre: 'Laura Torres', identificacion: '654987321', inicio: '2025-04-06' }, // Por vencer
        { id: 7, nombre: 'Roberto Díaz', identificacion: '147258369', inicio: '2025-05-01' }, // Vigente
        { id: 8, nombre: 'Sofía Ruiz', identificacion: '963852741', inicio: '2025-03-28' }, // Vencido
        { id: 9, nombre: 'Miguel Ángel', identificacion: '852963741', inicio: '2025-05-15' }, // Vigente
        { id: 10, nombre: 'Isabel Mora', identificacion: '741852963', inicio: '2025-05-20' }, // Vigente
        { id: 11, nombre: 'Valentina Castro', identificacion: '159753486', inicio: '2025-03-01' }, // Vencido
        { id: 12, nombre: 'Emilio Herrera', identificacion: '357951486', inicio: '2025-04-18' }, // Vigente
        { id: 13, nombre: 'Camila Ríos', identificacion: '258369147', inicio: '2025-04-10' }, // Vigente
        { id: 14, nombre: 'Javier Mendoza', identificacion: '951753852', inicio: '2025-03-30' }, // Vencido
        { id: 15, nombre: 'Lucía Vargas', identificacion: '753159486', inicio: '2025-04-22' }, // Vigente
        { id: 16, nombre: 'Andrés Salazar', identificacion: '654321987', inicio: '2025-04-07' }, // Por vencer
        { id: 17, nombre: 'Paula Jiménez', identificacion: '369258147', inicio: '2025-04-12' }, // Vigente
        { id: 18, nombre: 'Esteban Pardo', identificacion: '147369258', inicio: '2025-04-01' }, // Vencido
        { id: 19, nombre: 'Gabriela Silva', identificacion: '258147369', inicio: '2025-05-10' }, // Vigente
        { id: 20, nombre: 'Tomás Ortega', identificacion: '963741258', inicio: '2025-04-15' }, // Vigente
        { id: 21, nombre: 'Daniela Navarro', identificacion: '852147963', inicio: '2025-04-20' }, // Vigente
        { id: 22, nombre: 'Fernando Rojas', identificacion: '741963852', inicio: '2025-03-25' }, // Vencido
        { id: 23, nombre: 'Carolina Vega', identificacion: '963852147', inicio: '2025-05-05' }, // Vigente
        { id: 24, nombre: 'Ricardo Soto', identificacion: '852963147', inicio: '2025-04-28' }, // Vigente
        { id: 25, nombre: 'Patricia Flores', identificacion: '147852963', inicio: '2025-04-02' }, // Vencido
        { id: 26, nombre: 'Alejandro Mora', identificacion: '963147852', inicio: '2025-05-12' }, // Vigente
        { id: 27, nombre: 'Natalia Paredes', identificacion: '852147963', inicio: '2025-04-08' }, // Por vencer
        { id: 28, nombre: 'Hugo Mendoza', identificacion: '741852963', inicio: '2025-03-28' }, // Vencido
        { id: 29, nombre: 'Verónica Castro', identificacion: '963741852', inicio: '2025-05-11' }, // Vigente
        { id: 30, nombre: 'Eduardo Ríos', identificacion: '852963741', inicio: '2025-04-05' }, // Por vencer
        { id: 31, nombre: 'Mariana Torres', identificacion: '741963852', inicio: '2025-03-15' }, // Vencido
        { id: 32, nombre: 'Felipe Herrera', identificacion: '963852741', inicio: '2025-05-25' }, // Vigente
        { id: 33, nombre: 'Lorena Silva', identificacion: '852741963', inicio: '2025-04-09' }, // Por vencer
        { id: 34, nombre: 'Rodrigo Vargas', identificacion: '741852963', inicio: '2025-04-01' }, // Vencido
        { id: 35, nombre: 'Sandra Ortiz', identificacion: '963741852', inicio: '2025-05-19' }, // Vigente
        { id: 36, nombre: 'Manuel Pardo', identificacion: '852963741', inicio: '2025-04-04' }, // Por vencer
        { id: 37, nombre: 'Beatriz Rojas', identificacion: '741963852', inicio: '2025-03-21' }, // Vencido
        { id: 38, nombre: 'Alberto Soto', identificacion: '963852741', inicio: '2025-06-01' }, // Vigente
        { id: 39, nombre: 'Carmen Vega', identificacion: '852741963', inicio: '2025-04-06' }, // Por vencer
        { id: 40, nombre: 'Roberto Flores', identificacion: '741852963', inicio: '2025-03-03' }, // Vencido
        { id: 41, nombre: 'Diana Mora', identificacion: '963741852', inicio: '2025-05-24' }, // Vigente
        { id: 42, nombre: 'José Paredes', identificacion: '852963741', inicio: '2025-04-07' }, // Por vencer
        { id: 43, nombre: 'Laura Mendoza', identificacion: '741963852', inicio: '2025-04-02' }, // Vencido
        { id: 44, nombre: 'Carlos Castro', identificacion: '963852741', inicio: '2025-06-07' }, // Vigente
        { id: 45, nombre: 'Ana Ríos', identificacion: '852741963', inicio: '2025-04-08' }, // Por vencer
        { id: 46, nombre: 'Pedro Torres', identificacion: '741852963', inicio: '2025-03-09' }, // Vencido
        { id: 47, nombre: 'María Herrera', identificacion: '963741852', inicio: '2025-05-29' }, // Vigente
        { id: 48, nombre: 'Juan Silva', identificacion: '852963741', inicio: '2025-04-09' }, // Por vencer
        { id: 49, nombre: 'Sofía Vargas', identificacion: '741963852', inicio: '2025-03-30' }, // Vencido
        { id: 50, nombre: 'Miguel Ortiz', identificacion: '963852741', inicio: '2025-06-13' }, // Vigente
        { id: 51, nombre: 'Isabel Pardo', identificacion: '852741963', inicio: '2025-04-05' }, // Por vencer
        { id: 52, nombre: 'Francisco Rojas', identificacion: '741852963', inicio: '2025-02-15' }, // Vencido
        { id: 53, nombre: 'Lucía Soto', identificacion: '963741852', inicio: '2025-06-02' }, // Vigente
        { id: 54, nombre: 'Antonio Vega', identificacion: '852963741', inicio: '2025-04-06' }, // Por vencer
        { id: 55, nombre: 'Elena Flores', identificacion: '741963852', inicio: '2025-03-03' }, // Vencido
        { id: 56, nombre: 'Javier Mora', identificacion: '963852741', inicio: '2025-03-18' }, // Vencido
        { id: 57, nombre: 'Carmen Paredes', identificacion: '852741963', inicio: '2025-05-15' }, // Vigente
        { id: 58, nombre: 'Diego Mendoza', identificacion: '741852963', inicio: '2025-04-07' }, // Por vencer
        { id: 59, nombre: 'Rosa Castro', identificacion: '963741852', inicio: '2025-03-20' }, // Vencido
        { id: 60, nombre: 'Alberto Ríos', identificacion: '852963741', inicio: '2025-06-23' }, // Vigente
        { id: 61, nombre: 'Marta Torres', identificacion: '741963852', inicio: '2025-04-08' }, // Por vencer
        { id: 62, nombre: 'Raúl Herrera', identificacion: '963852741', inicio: '2025-03-25' }, // Vencido
        { id: 63, nombre: 'Teresa Silva', identificacion: '852741963', inicio: '2025-05-20' }, // Vigente
        { id: 64, nombre: 'Fernando Vargas', identificacion: '741852963', inicio: '2025-04-09' }, // Por vencer
        { id: 65, nombre: 'Pilar Ortiz', identificacion: '963741852', inicio: '2025-03-10' }, // Vencido
        { id: 66, nombre: 'Santiago Pardo', identificacion: '852963741', inicio: '2025-06-29' }, // Vigente
        { id: 67, nombre: 'Nuria Rojas', identificacion: '741963852', inicio: '2025-04-04' }, // Por vencer
        { id: 68, nombre: 'Óscar Soto', identificacion: '963852741', inicio: '2025-03-01' }, // Vencido
        { id: 69, nombre: 'Concha Vega', identificacion: '852741963', inicio: '2025-05-13' }, // Vigente
        { id: 70, nombre: 'Rubén Flores', identificacion: '741852963', inicio: '2025-04-05' }, // Por vencer
        { id: 71, nombre: 'Lourdes Mora', identificacion: '963741852', inicio: '2025-03-14' }, // Vencido
        { id: 72, nombre: 'Víctor Paredes', identificacion: '852963741', inicio: '2025-07-05' }, // Vigente
        { id: 73, nombre: 'Aurora Mendoza', identificacion: '741963852', inicio: '2025-04-06' }, // Por vencer
        { id: 74, nombre: 'Héctor Castro', identificacion: '963852741', inicio: '2025-03-07' }, // Vencido
        { id: 75, nombre: 'Mercedes Ríos', identificacion: '852741963', inicio: '2025-05-17' }, // Vigente
        { id: 76, nombre: 'Félix Torres', identificacion: '741852963', inicio: '2025-04-07' }, // Por vencer
        { id: 77, nombre: 'Dolores Herrera', identificacion: '963741852', inicio: '2025-03-19' }, // Vencido
        { id: 78, nombre: 'Emilio Silva', identificacion: '852963741', inicio: '2025-07-11' }, // Vigente
        { id: 79, nombre: 'Rosario Vargas', identificacion: '741963852', inicio: '2025-04-08' }, // Por vencer
        { id: 80, nombre: 'Manuel Ortiz', identificacion: '963852741', inicio: '2025-03-13' }, // Vencido
        { id: 81, nombre: 'Julia Pardo', identificacion: '852741963', inicio: '2025-05-23' }, // Vigente
        { id: 82, nombre: 'Alfonso Rojas', identificacion: '741852963', inicio: '2025-04-09' }, // Por vencer
        { id: 83, nombre: 'Marina Soto', identificacion: '963741852', inicio: '2025-03-24' }, // Vencido
        { id: 84, nombre: 'Ricardo Vega', identificacion: '852963741', inicio: '2025-07-17' }, // Vigente
        { id: 85, nombre: 'Natalia Flores', identificacion: '741963852', inicio: '2025-04-04' }, // Por vencer
        { id: 86, nombre: 'Guillermo Mora', identificacion: '963852741', inicio: '2025-03-19' }, // Vencido
        { id: 87, nombre: 'Cristina Paredes', identificacion: '852741963', inicio: '2025-05-27' }, // Vigente
        { id: 88, nombre: 'Adrián Mendoza', identificacion: '741852963', inicio: '2025-04-05' }, // Por vencer
        { id: 89, nombre: 'Beatriz Castro', identificacion: '963741852', inicio: '2025-03-29' }, // Vencido
        { id: 90, nombre: 'Jorge Ríos', identificacion: '852963741', inicio: '2025-07-23' }, // Vigente
        { id: 91, nombre: 'Sara Torres', identificacion: '741963852', inicio: '2025-04-06' }, // Por vencer
        { id: 92, nombre: 'Pablo Herrera', identificacion: '963852741', inicio: '2025-03-25' }, // Vencido
        { id: 93, nombre: 'Elena Silva', identificacion: '852741963', inicio: '2025-06-02' }, // Vigente
        { id: 94, nombre: 'David Vargas', identificacion: '741852963', inicio: '2025-04-07' }, // Por vencer
        { id: 95, nombre: 'Laura Ortiz', identificacion: '963741852', inicio: '2025-03-04' }, // Vencido
        { id: 96, nombre: 'Ángel Pardo', identificacion: '852963741', inicio: '2025-07-29' }, // Vigente
        { id: 97, nombre: 'Mónica Rojas', identificacion: '741963852', inicio: '2025-04-08' }, // Por vencer
        { id: 98, nombre: 'José Soto', identificacion: '963852741', inicio: '2025-03-31' }, // Vencido
        { id: 99, nombre: 'Ana Vega', identificacion: '852741963', inicio: '2025-06-08' }, // Vigente
        { id: 100, nombre: 'Carlos Flores', identificacion: '741852963', inicio: '2025-04-09' }, // Por vencer
        { id: 101, nombre: 'Rafael Mora', identificacion: '963852741', inicio: '2025-03-10' }, // Vencido
        { id: 102, nombre: 'Isabel Paredes', identificacion: '852741963', inicio: '2025-08-04' }, // Vigente
        { id: 103, nombre: 'Luis Mendoza', identificacion: '741963852', inicio: '2025-04-04' }, // Por vencer
        { id: 104, nombre: 'Patricia Castro', identificacion: '963852741', inicio: '2025-03-06' }, // Vencido
        { id: 105, nombre: 'Roberto Ríos', identificacion: '852741963', inicio: '2025-06-14' }, // Vigente
        { id: 106, nombre: 'Carmen Torres', identificacion: '741852963', inicio: '2025-04-05' }, // Por vencer
        { id: 107, nombre: 'Javier Herrera', identificacion: '963741852', inicio: '2025-03-16' }, // Vencido
        { id: 108, nombre: 'María Silva', identificacion: '852963741', inicio: '2025-08-10' }, // Vigente
        { id: 109, nombre: 'Antonio Vargas', identificacion: '741963852', inicio: '2025-04-06' }, // Por vencer
        { id: 110, nombre: 'Elena Ortiz', identificacion: '963852741', inicio: '2025-03-12' }, // Vencido
        { id: 111, nombre: 'Francisco Pardo', identificacion: '852741963', inicio: '2025-06-20' }, // Vigente
        { id: 112, nombre: 'Lucía Rojas', identificacion: '741852963', inicio: '2025-04-07' }, // Por vencer
        { id: 113, nombre: 'Miguel Soto', identificacion: '963741852', inicio: '2025-03-22' }, // Vencido
        { id: 114, nombre: 'Sofía Vega', identificacion: '852963741', inicio: '2025-08-16' }, // Vigente
        { id: 115, nombre: 'Juan Flores', identificacion: '741963852', inicio: '2025-04-08' }, // Por vencer
        { id: 116, nombre: 'Ana Mora', identificacion: '963852741', inicio: '2025-03-18' }, // Vencido
        { id: 117, nombre: 'Pedro Paredes', identificacion: '852741963', inicio: '2025-06-26' }, // Vigente
        { id: 118, nombre: 'Laura Mendoza', identificacion: '741852963', inicio: '2025-04-09' }, // Por vencer
        { id: 119, nombre: 'Carlos Castro', identificacion: '963741852', inicio: '2025-03-28' }, // Vencido
        { id: 120, nombre: 'María Ríos', identificacion: '852963741', inicio: '2025-08-22' }, // Vigente
        { id: 121, nombre: 'José Torres', identificacion: '741963852', inicio: '2025-04-04' }, // Por vencer
        { id: 122, nombre: 'Isabel Herrera', identificacion: '963852741', inicio: '2025-03-24' }, // Vencido
        { id: 123, nombre: 'Francisco Silva', identificacion: '852741963', inicio: '2025-07-02' }, // Vigente
        { id: 124, nombre: 'Lucía Vargas', identificacion: '741852963', inicio: '2025-04-05' }, // Por vencer
        { id: 125, nombre: 'Miguel Ortiz', identificacion: '963741852', inicio: '2025-03-04' }, // Vencido
        { id: 126, nombre: 'Sofía Pardo', identificacion: '852963741', inicio: '2025-08-28' }, // Vigente
        { id: 127, nombre: 'Juan Rojas', identificacion: '741963852', inicio: '2025-04-06' }, // Por vencer
        { id: 128, nombre: 'Ana Soto', identificacion: '963852741', inicio: '2025-03-30' }, // Vencido (Modificado antes)
        { id: 129, nombre: 'Pedro Vega', identificacion: '852741963', inicio: '2025-04-08' }, // Por vencer (Modificado antes)
        { id: 130, nombre: 'Laura Flores', identificacion: '741852963', inicio: '2025-09-01' }  // Vigente (Modificado antes)
    ];

    // Procesar los datos - ORDENADOS DE FORMA DESCENDENTE POR ID
    const datosProcesados = datos
        .slice() // Crear una copia del array para no modificar el original
        .sort((a, b) => b.id - a.id) // Ordenar de forma descendente por ID
        .map(item => {
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
        <div className="container mx-auto px-8 py-10">
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
        </div>
    );
};

export default Home; 