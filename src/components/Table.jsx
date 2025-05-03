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
        if (!fecha) return ''; // Handle cases where date might be missing
        const date = new Date(fecha);
        // Check if the date is valid
        if (isNaN(date.getTime())) {
            console.error("Fecha inválida:", fecha);
            return ''; // Return empty string or a default value for invalid dates
        }
        const dia = date.getDate();
        const mes = (date.getMonth() + 1).toString().padStart(2, '0');
        const año = date.getFullYear();
        return `${dia}/${mes}/${año}`;
    };

    // Función para calcular la fecha fin (planDias después del ultimoPago, contando el ultimoPago como día 1)
    const calcularFechaFin = (ultimoPago, planDias) => {
        if (!ultimoPago || planDias === undefined || planDias === null) return ''; // Handle missing data
        const fecha = new Date(ultimoPago);
         if (isNaN(fecha.getTime())) {
            console.error("Fecha de último pago inválida para calcular fecha fin:", ultimoPago);
            return ''; // Return empty string for invalid dates
        }
        // Add planDias - 1 because the ultimoPago day counts as day 1
        fecha.setDate(fecha.getDate() + planDias - 1);
        return formatearFecha(fecha);
    };

    // Función para calcular el estado y días de mora
    const calcularEstadoYDiasMora = (fechaFin) => {
        if (!fechaFin) return { estado: '', diasMora: '' }; // Handle cases where date might be missing
        const fechaActual = new Date();
        const [dia, mes, año] = fechaFin.split('/');
        const fin = new Date(año, mes - 1, dia);

        if (isNaN(fin.getTime())) {
             console.error("Fecha fin inválida para calcular estado y días de mora:", fechaFin);
             return { estado: '', diasMora: '' }; // Return empty for invalid dates
        }

        // Set hours, minutes, seconds, and milliseconds to 0 for accurate day comparison
        fechaActual.setHours(0, 0, 0, 0);
        fin.setHours(0, 0, 0, 0);

        const diferenciaTiempo = fechaActual - fin;
        const diferenciaDias = Math.floor(diferenciaTiempo / (1000 * 60 * 60 * 24));

        if (diferenciaDias > 0) {
            return { estado: 'Vencido', diasMora: diferenciaDias };
        } else if (diferenciaDias >= -5 && diferenciaDias <= 0) { // Include today as not expired yet, up to 5 days before
            return { estado: 'Por vencer', diasMora: "" };
        } else {
            return { estado: 'Vigente', diasMora: "" };
        }
    };

    // Función para eliminar tildes/acentos de un string
    const quitarTildes = (texto) =>
        texto.normalize('NFD').replace(/\p{Diacritic}/gu, '');

    // Datos de ejemplo COMPLETOS y ajustados - Campo 'inicio' eliminado
    const datos = [
        { id: 1, nombre: 'Juan Pérez', identificacion: '123456789', telefono: '3001112233', fechaInscripcion: '2025-04-14', ultimoPago: '2025-04-14', planDias: 30 },
        { id: 2, nombre: 'María García', identificacion: '987654321', telefono: '3102223344', fechaInscripcion: '2025-04-04', ultimoPago: '2025-04-04', planDias: 30 },
        { id: 3, nombre: 'Carlos López', identificacion: '456789123', telefono: '3203334455', fechaInscripcion: '2025-03-10', ultimoPago: '2025-03-10', planDias: 30 },
        { id: 4, nombre: 'Ana Martínez', identificacion: '789123456', telefono: '3014445566', fechaInscripcion: '2025-04-25', ultimoPago: '2025-04-25', planDias: 30 },
        { id: 5, nombre: 'Pedro Sánchez', identificacion: '321654987', telefono: '3025556677', fechaInscripcion: '2025-04-09', ultimoPago: '2025-04-09', planDias: 15 }, // Plan 15 días
        { id: 6, nombre: 'Laura Torres', identificacion: '654987321', telefono: '3036667788', fechaInscripcion: '2025-04-06', ultimoPago: '2025-04-06', planDias: 30 },
        { id: 7, nombre: 'Roberto Díaz', identificacion: '147258369', telefono: '3047778899', fechaInscripcion: '2025-05-01', ultimoPago: '2025-05-01', planDias: 30 },
        { id: 8, nombre: 'Sofía Ruiz', identificacion: '963852741', telefono: '3058889900', fechaInscripcion: '2025-03-28', ultimoPago: '2025-03-28', planDias: 30 },
        { id: 9, nombre: 'Miguel Ángel', identificacion: '852963741', telefono: '3069990011', fechaInscripcion: '2025-05-15', ultimoPago: '2025-05-15', planDias: 15 }, // Plan 15 días
        { id: 10, nombre: 'Isabel Mora', identificacion: '741852963', telefono: '3070001122', fechaInscripcion: '2025-05-20', ultimoPago: '2025-05-20', planDias: 30 },
        { id: 11, nombre: 'Valentina Castro', identificacion: '159753486', telefono: '3081112233', fechaInscripcion: '2025-03-01', ultimoPago: '2025-03-01', planDias: 30 },
        { id: 12, nombre: 'Emilio Herrera', identificacion: '357951486', telefono: '3092223344', fechaInscripcion: '2025-04-18', ultimoPago: '2025-04-18', planDias: 30 },
        { id: 13, nombre: 'Camila Ríos', identificacion: '258369147', telefono: '3103334455', fechaInscripcion: '2025-04-10', ultimoPago: '2025-04-10', planDias: 15 }, // Plan 15 días
        { id: 14, nombre: 'Javier Mendoza', identificacion: '951753852', telefono: '3114445566', fechaInscripcion: '2025-03-30', ultimoPago: '2025-03-30', planDias: 30 },
        { id: 15, nombre: 'Lucía Vargas', identificacion: '753159486', telefono: '3125556677', fechaInscripcion: '2025-04-22', ultimoPago: '2025-04-22', planDias: 30 },
        { id: 16, nombre: 'Andrés Salazar', identificacion: '654321987', telefono: '3136667788', fechaInscripcion: '2025-04-07', ultimoPago: '2025-04-07', planDias: 15 }, // Plan 15 días
        { id: 17, nombre: 'Paula Jiménez', identificacion: '369258147', telefono: '3147778899', fechaInscripcion: '2025-04-12', ultimoPago: '2025-04-12', planDias: 30 },
        { id: 18, nombre: 'Esteban Pardo', identificacion: '147369258', telefono: '3158889900', fechaInscripcion: '2025-04-01', ultimoPago: '2025-04-01', planDias: 30 },
        { id: 19, nombre: 'Gabriela Silva', identificacion: '258147369', telefono: '3169990011', fechaInscripcion: '2025-05-10', ultimoPago: '2025-05-10', planDias: 15 }, // Plan 15 días
        { id: 20, nombre: 'Tomás Ortega', identificacion: '963741258', telefono: '3170001122', fechaInscripcion: '2025-04-15', ultimoPago: '2025-04-15', planDias: 30 },
        { id: 21, nombre: 'Daniela Navarro', identificacion: '852147963', telefono: '3181112233', fechaInscripcion: '2025-04-20', ultimoPago: '2025-04-20', planDias: 30 },
        { id: 22, nombre: 'Fernando Rojas', identificacion: '741963852', telefono: '3192223344', fechaInscripcion: '2025-03-25', ultimoPago: '2025-03-25', planDias: 30 },
        { id: 23, nombre: 'Carolina Vega', identificacion: '963852147', telefono: '3203334455', fechaInscripcion: '2025-05-05', ultimoPago: '2025-05-05', planDias: 15 }, // Plan 15 días
        { id: 24, nombre: 'Ricardo Soto', identificacion: '852963147', telefono: '3214445566', fechaInscripcion: '2025-04-28', ultimoPago: '2025-04-28', planDias: 30 },
        { id: 25, nombre: 'Patricia Flores', identificacion: '147852963', telefono: '3225556677', fechaInscripcion: '2025-04-02', ultimoPago: '2025-04-02', planDias: 30 },
        { id: 26, nombre: 'Alejandro Mora', identificacion: '963147852', telefono: '3236667788', fechaInscripcion: '2025-05-12', ultimoPago: '2025-05-12', planDias: 15 }, // Plan 15 días
        { id: 27, nombre: 'Natalia Paredes', identificacion: '852147963', telefono: '3247778899', fechaInscripcion: '2025-04-08', ultimoPago: '2025-04-08', planDias: 30 },
        { id: 28, nombre: 'Hugo Mendoza', identificacion: '741852963', telefono: '3258889900', fechaInscripcion: '2025-03-28', ultimoPago: '2025-03-28', planDias: 30 },
        { id: 29, nombre: 'Verónica Castro', identificacion: '963741852', telefono: '3269990011', fechaInscripcion: '2025-05-11', ultimoPago: '2025-05-11', planDias: 15 }, // Plan 15 días
        { id: 30, nombre: 'Eduardo Ríos', identificacion: '852963741', telefono: '3270001122', fechaInscripcion: '2025-04-05', ultimoPago: '2025-04-05', planDias: 30 },
        { id: 31, nombre: 'Mariana Torres', identificacion: '741963852', telefono: '3281112233', fechaInscripcion: '2025-03-15', ultimoPago: '2025-03-15', planDias: 30 },
        { id: 32, nombre: 'Felipe Herrera', identificacion: '963852741', telefono: '3292223344', fechaInscripcion: '2025-05-25', ultimoPago: '2025-05-25', planDias: 15 }, // Plan 15 días
        { id: 33, nombre: 'Lorena Silva', identificacion: '852741963', telefono: '3303334455', fechaInscripcion: '2025-04-09', ultimoPago: '2025-04-09', planDias: 30 },
        { id: 34, nombre: 'Rodrigo Vargas', identificacion: '741852963', telefono: '3314445566', fechaInscripcion: '2025-04-01', ultimoPago: '2025-04-01', planDias: 30 },
        { id: 35, nombre: 'Sandra Ortiz', identificacion: '963741852', telefono: '3325556677', fechaInscripcion: '2025-05-19', ultimoPago: '2025-05-19', planDias: 15 }, // Plan 15 días
        { id: 36, nombre: 'Manuel Pardo', identificacion: '852963741', telefono: '3336667788', fechaInscripcion: '2025-04-04', ultimoPago: '2025-04-04', planDias: 30 },
        { id: 37, nombre: 'Beatriz Rojas', identificacion: '741963852', telefono: '3347778899', fechaInscripcion: '2025-03-21', ultimoPago: '2025-03-21', planDias: 30 },
        { id: 38, nombre: 'Alberto Soto', identificacion: '963852741', telefono: '3358889900', fechaInscripcion: '2025-06-01', ultimoPago: '2025-06-01', planDias: 15 }, // Plan 15 días
        { id: 39, nombre: 'Carmen Vega', identificacion: '852741963', telefono: '3369990011', fechaInscripcion: '2025-04-06', ultimoPago: '2025-04-06', planDias: 30 },
        { id: 40, nombre: 'Roberto Flores', identificacion: '741852963', telefono: '3370001122', fechaInscripcion: '2025-03-03', ultimoPago: '2025-03-03', planDias: 30 },
        { id: 41, nombre: 'Diana Mora', identificacion: '963741852', telefono: '3381112233', fechaInscripcion: '2025-05-24', ultimoPago: '2025-05-24', planDias: 15 }, // Plan 15 días
        { id: 42, nombre: 'José Paredes', identificacion: '852963741', telefono: '3392223344', fechaInscripcion: '2025-04-07', ultimoPago: '2025-04-07', planDias: 30 },
        { id: 43, nombre: 'Laura Mendoza', identificacion: '741963852', telefono: '3403334455', fechaInscripcion: '2025-04-02', ultimoPago: '2025-04-02', planDias: 30 },
        { id: 44, nombre: 'Carlos Castro', identificacion: '963852741', telefono: '3414445566', fechaInscripcion: '2025-06-07', ultimoPago: '2025-06-07', planDias: 15 }, // Plan 15 días
        { id: 45, nombre: 'Ana Ríos', identificacion: '852741963', telefono: '3425556677', fechaInscripcion: '2025-04-08', ultimoPago: '2025-04-08', planDias: 30 },
        { id: 46, nombre: 'Pedro Torres', identificacion: '741852963', telefono: '3436667788', fechaInscripcion: '2025-03-09', ultimoPago: '2025-03-09', planDias: 30 },
        { id: 47, nombre: 'María Herrera', identificacion: '963741852', telefono: '3447778899', fechaInscripcion: '2025-05-29', ultimoPago: '2025-05-29', planDias: 15 }, // Plan 15 días
        { id: 48, nombre: 'Juan Silva', identificacion: '852963741', telefono: '3458889900', fechaInscripcion: '2025-04-09', ultimoPago: '2025-04-09', planDias: 30 },
        { id: 49, nombre: 'Sofía Vargas', identificacion: '741963852', telefono: '3469990011', fechaInscripcion: '2025-03-30', ultimoPago: '2025-03-30', planDias: 30 },
        { id: 50, nombre: 'Miguel Ortiz', identificacion: '963852741', telefono: '3470001122', fechaInscripcion: '2025-06-13', ultimoPago: '2025-06-13', planDias: 15 }, // Plan 15 días
        { id: 51, nombre: 'Isabel Pardo', identificacion: '852741963', telefono: '3481112233', fechaInscripcion: '2025-04-05', ultimoPago: '2025-04-05', planDias: 30 },
        { id: 52, nombre: 'Francisco Rojas', identificacion: '741852963', telefono: '3492223344', fechaInscripcion: '2025-02-15', ultimoPago: '2025-02-15', planDias: 30 },
        { id: 53, nombre: 'Lucía Soto', identificacion: '963741852', telefono: '3503334455', fechaInscripcion: '2025-06-02', ultimoPago: '2025-06-02', planDias: 15 }, // Plan 15 días
        { id: 54, nombre: 'Antonio Vega', identificacion: '852963741', telefono: '3514445566', fechaInscripcion: '2025-04-06', ultimoPago: '2025-04-06', planDias: 30 },
        { id: 55, nombre: 'Elena Flores', identificacion: '741963852', telefono: '3525556677', fechaInscripcion: '2025-03-03', ultimoPago: '2025-03-03', planDias: 30 },
        { id: 56, nombre: 'Javier Mora', identificacion: '963852741', telefono: '3536667788', fechaInscripcion: '2025-03-18', ultimoPago: '2025-03-18', planDias: 15 }, // Plan 15 días
        { id: 57, nombre: 'Carmen Paredes', identificacion: '852741963', telefono: '3547778899', fechaInscripcion: '2025-05-15', ultimoPago: '2025-05-15', planDias: 30 },
        { id: 58, nombre: 'Diego Mendoza', identificacion: '741852963', telefono: '3558889900', fechaInscripcion: '2025-04-07', ultimoPago: '2025-04-07', planDias: 30 },
        { id: 59, nombre: 'Rosa Castro', identificacion: '963741852', telefono: '3569990011', fechaInscripcion: '2025-03-20', ultimoPago: '2025-03-20', planDias: 15 }, // Plan 15 días
        { id: 60, nombre: 'Alberto Ríos', identificacion: '852963741', telefono: '3570001122', fechaInscripcion: '2025-06-23', ultimoPago: '2025-06-23', planDias: 30 },
        { id: 61, nombre: 'Marta Torres', identificacion: '741963852', telefono: '3581112233', fechaInscripcion: '2025-04-08', ultimoPago: '2025-04-08', planDias: 30 },
        { id: 62, nombre: 'Raúl Herrera', identificacion: '963852741', telefono: '3592223344', fechaInscripcion: '2025-03-25', ultimoPago: '2025-03-25', planDias: 15 }, // Plan 15 días
        { id: 63, nombre: 'Teresa Silva', identificacion: '852741963', telefono: '3603334455', fechaInscripcion: '2025-05-20', ultimoPago: '2025-05-20', planDias: 30 },
        { id: 64, nombre: 'Fernando Vargas', identificacion: '741852963', telefono: '3614445566', fechaInscripcion: '2025-04-09', ultimoPago: '2025-04-09', planDias: 30 },
        { id: 65, nombre: 'Pilar Ortiz', identificacion: '963741852', telefono: '3625556677', fechaInscripcion: '2025-03-10', ultimoPago: '2025-03-10', planDias: 15 }, // Plan 15 días
        { id: 66, nombre: 'Santiago Pardo', identificacion: '852963741', telefono: '3636667788', fechaInscripcion: '2025-06-29', ultimoPago: '2025-06-29', planDias: 30 },
        { id: 67, nombre: 'Nuria Rojas', identificacion: '741963852', telefono: '3647778899', fechaInscripcion: '2025-04-04', ultimoPago: '2025-04-04', planDias: 30 },
        { id: 68, nombre: 'Óscar Soto', identificacion: '963852741', telefono: '3658889900', fechaInscripcion: '2025-03-01', ultimoPago: '2025-03-01', planDias: 15 }, // Plan 15 días
        { id: 69, nombre: 'Concha Vega', identificacion: '852741963', telefono: '3669990011', fechaInscripcion: '2025-05-13', ultimoPago: '2025-05-13', planDias: 30 },
        { id: 70, nombre: 'Rubén Flores', identificacion: '741852963', telefono: '3670001122', fechaInscripcion: '2025-04-05', ultimoPago: '2025-04-05', planDias: 30 },
        { id: 71, nombre: 'Lourdes Mora', identificacion: '963741852', telefono: '3681112233', fechaInscripcion: '2025-03-14', ultimoPago: '2025-03-14', planDias: 15 }, // Plan 15 días
        { id: 72, nombre: 'Víctor Paredes', identificacion: '852963741', telefono: '3692223344', fechaInscripcion: '2025-07-05', ultimoPago: '2025-07-05', planDias: 30 },
        { id: 73, nombre: 'Aurora Mendoza', identificacion: '741963852', telefono: '3703334455', fechaInscripcion: '2025-04-06', ultimoPago: '2025-04-06', planDias: 30 },
        { id: 74, nombre: 'Héctor Castro', identificacion: '963852741', telefono: '3714445566', fechaInscripcion: '2025-03-07', ultimoPago: '2025-03-07', planDias: 15 }, // Plan 15 días
        { id: 75, nombre: 'Mercedes Ríos', identificacion: '852741963', telefono: '3725556677', fechaInscripcion: '2025-05-17', ultimoPago: '2025-05-17', planDias: 30 },
        { id: 76, nombre: 'Félix Torres', identificacion: '741852963', telefono: '3736667788', fechaInscripcion: '2025-04-07', ultimoPago: '2025-04-07', planDias: 30 },
        { id: 77, nombre: 'Dolores Herrera', identificacion: '963741852', telefono: '3747778899', fechaInscripcion: '2025-03-19', ultimoPago: '2025-03-19', planDias: 15 }, // Plan 15 días
        { id: 78, nombre: 'Emilio Silva', identificacion: '852963741', telefono: '3758889900', fechaInscripcion: '2025-07-11', ultimoPago: '2025-07-11', planDias: 30 },
        { id: 79, nombre: 'Rosario Vargas', identificacion: '741963852', telefono: '3769990011', fechaInscripcion: '2025-04-08', ultimoPago: '2025-04-08', planDias: 30 },
        { id: 80, nombre: 'Manuel Ortiz', identificacion: '963852741', telefono: '3770001122', fechaInscripcion: '2025-03-13', ultimoPago: '2025-03-13', planDias: 15 }, // Plan 15 días
        { id: 81, nombre: 'Julia Pardo', identificacion: '852741963', telefono: '3781112233', fechaInscripcion: '2025-05-23', ultimoPago: '2025-05-23', planDias: 30 },
        { id: 82, nombre: 'Alfonso Rojas', identificacion: '741852963', telefono: '3792223344', fechaInscripcion: '2025-04-09', ultimoPago: '2025-04-09', planDias: 30 },
        { id: 83, nombre: 'Marina Soto', identificacion: '963741852', telefono: '3803334455', fechaInscripcion: '2025-03-24', ultimoPago: '2025-03-24', planDias: 15 }, // Plan 15 días
        { id: 84, nombre: 'Ricardo Vega', identificacion: '852963741', telefono: '3814445566', fechaInscripcion: '2025-07-17', ultimoPago: '2025-07-17', planDias: 30 },
        { id: 85, nombre: 'Natalia Flores', identificacion: '741963852', telefono: '3825556677', fechaInscripcion: '2025-04-04', ultimoPago: '2025-04-04', planDias: 30 },
        { id: 86, nombre: 'Guillermo Mora', identificacion: '963852741', telefono: '3836667788', fechaInscripcion: '2025-03-19', ultimoPago: '2025-03-19', planDias: 15 }, // Plan 15 días
        { id: 87, nombre: 'Cristina Paredes', identificacion: '852741963', telefono: '3847778899', fechaInscripcion: '2025-05-27', ultimoPago: '2025-05-27', planDias: 30 },
        { id: 88, nombre: 'Adrián Mendoza', identificacion: '741852963', telefono: '3858889900', fechaInscripcion: '2025-04-05', ultimoPago: '2025-04-05', planDias: 30 },
        { id: 89, nombre: 'Beatriz Castro', identificacion: '963741852', telefono: '3869990011', fechaInscripcion: '2025-03-29', ultimoPago: '2025-03-29', planDias: 15 }, // Plan 15 días
        { id: 90, nombre: 'Jorge Ríos', identificacion: '852963741', telefono: '3870001122', fechaInscripcion: '2025-07-23', ultimoPago: '2025-07-23', planDias: 30 },
        { id: 91, nombre: 'Sara Torres', identificacion: '741963852', telefono: '3881112233', fechaInscripcion: '2025-04-06', ultimoPago: '2025-04-06', planDias: 30 },
        { id: 92, nombre: 'Pablo Herrera', identificacion: '963852741', telefono: '3892223344', fechaInscripcion: '2025-03-25', ultimoPago: '2025-03-25', planDias: 15 }, // Plan 15 días
        { id: 93, nombre: 'Elena Silva', identificacion: '852741963', telefono: '3903334455', fechaInscripcion: '2025-06-02', ultimoPago: '2025-06-02', planDias: 30 },
        { id: 94, nombre: 'David Vargas', identificacion: '741852963', telefono: '3914445566', fechaInscripcion: '2025-04-07', ultimoPago: '2025-04-07', planDias: 30 },
        { id: 95, nombre: 'Laura Ortiz', identificacion: '963741852', telefono: '3925556677', fechaInscripcion: '2025-03-04', ultimoPago: '2025-03-04', planDias: 15 }, // Plan 15 días
        { id: 96, nombre: 'Ángel Pardo', identificacion: '852963741', telefono: '3936667788', fechaInscripcion: '2025-07-29', ultimoPago: '2025-07-29', planDias: 30 },
        { id: 97, nombre: 'Mónica Rojas', identificacion: '741963852', telefono: '3947778899', fechaInscripcion: '2025-04-08', ultimoPago: '2025-04-08', planDias: 30 },
        { id: 98, nombre: 'José Soto', identificacion: '963852741', telefono: '3958889900', fechaInscripcion: '2025-03-31', ultimoPago: '2025-03-31', planDias: 15 }, // Plan 15 días
        { id: 99, nombre: 'Ana Vega', identificacion: '852741963', telefono: '3969990011', fechaInscripcion: '2025-06-08', ultimoPago: '2025-06-08', planDias: 30 },
        { id: 100, nombre: 'Carlos Flores', identificacion: '741852963', telefono: '3970001122', fechaInscripcion: '2025-04-09', ultimoPago: '2025-04-09', planDias: 30 },
        { id: 101, nombre: 'Rafael Mora', identificacion: '963852741', telefono: '3981112233', fechaInscripcion: '2025-03-10', ultimoPago: '2025-03-10', planDias: 15 }, // Plan 15 días
        { id: 102, nombre: 'Isabel Paredes', identificacion: '852741963', telefono: '3992223344', fechaInscripcion: '2025-08-04', ultimoPago: '2025-08-04', planDias: 30 },
        { id: 103, nombre: 'Luis Mendoza', identificacion: '741963852', telefono: '3003334455', fechaInscripcion: '2025-04-04', ultimoPago: '2025-04-04', planDias: 30 },
        { id: 104, nombre: 'Patricia Castro', identificacion: '963852741', telefono: '3014445566', fechaInscripcion: '2025-03-06', ultimoPago: '2025-03-06', planDias: 15 }, // Plan 15 días
        { id: 105, nombre: 'Roberto Ríos', identificacion: '852741963', telefono: '3025556677', fechaInscripcion: '2025-06-14', ultimoPago: '2025-06-14', planDias: 30 },
        { id: 106, nombre: 'Carmen Torres', identificacion: '741852963', telefono: '3036667788', fechaInscripcion: '2025-04-05', ultimoPago: '2025-04-05', planDias: 30 },
        { id: 107, nombre: 'Javier Herrera', identificacion: '963741852', telefono: '3047778899', fechaInscripcion: '2025-03-16', ultimoPago: '2025-03-16', planDias: 15 }, // Plan 15 días
        { id: 108, nombre: 'María Silva', identificacion: '852963741', telefono: '3058889900', fechaInscripcion: '2025-08-10', ultimoPago: '2025-08-10', planDias: 30 },
        { id: 109, nombre: 'Antonio Vargas', identificacion: '741963852', telefono: '3069990011', fechaInscripcion: '2025-04-06', ultimoPago: '2025-04-06', planDias: 30 },
        { id: 110, nombre: 'Elena Ortiz', identificacion: '963852741', telefono: '3070001122', fechaInscripcion: '2025-03-12', ultimoPago: '2025-03-12', planDias: 15 }, // Plan 15 días
        { id: 111, nombre: 'Francisco Pardo', identificacion: '852741963', telefono: '3081112233', fechaInscripcion: '2025-06-20', ultimoPago: '2025-06-20', planDias: 30 },
        { id: 112, nombre: 'Lucía Rojas', identificacion: '741852963', telefono: '3092223344', fechaInscripcion: '2025-04-07', ultimoPago: '2025-04-07', planDias: 30 },
        { id: 113, nombre: 'Miguel Soto', identificacion: '963741852', telefono: '3103334455', fechaInscripcion: '2025-03-22', ultimoPago: '2025-03-22', planDias: 15 }, // Plan 15 días
        { id: 114, nombre: 'Sofía Vega', identificacion: '852963741', telefono: '3114445566', fechaInscripcion: '2025-08-16', ultimoPago: '2025-08-16', planDias: 30 },
        { id: 115, nombre: 'Juan Flores', identificacion: '741963852', telefono: '3125556677', fechaInscripcion: '2025-04-08', ultimoPago: '2025-04-08', planDias: 30 },
        { id: 116, nombre: 'Ana Mora', identificacion: '963852741', telefono: '3136667788', fechaInscripcion: '2025-03-18', ultimoPago: '2025-03-18', planDias: 15 }, // Plan 15 días
        { id: 117, nombre: 'Pedro Paredes', identificacion: '852741963', telefono: '3147778899', fechaInscripcion: '2025-06-26', ultimoPago: '2025-06-26', planDias: 30 },
        { id: 118, nombre: 'Laura Mendoza', identificacion: '741852963', telefono: '3158889900', fechaInscripcion: '2025-04-09', ultimoPago: '2025-04-09', planDias: 30 },
        { id: 119, nombre: 'Carlos Castro', identificacion: '963741852', telefono: '3169990011', fechaInscripcion: '2025-03-28', ultimoPago: '2025-03-28', planDias: 15 }, // Plan 15 días
        { id: 120, nombre: 'María Ríos', identificacion: '852963741', telefono: '3170001122', fechaInscripcion: '2025-08-22', ultimoPago: '2025-08-22', planDias: 30 },
        { id: 121, nombre: 'José Torres', identificacion: '741963852', telefono: '3181112233', fechaInscripcion: '2025-04-04', ultimoPago: '2025-04-04', planDias: 30 },
        { id: 122, nombre: 'Isabel Herrera', identificacion: '963852741', telefono: '3192223344', fechaInscripcion: '2025-03-24', ultimoPago: '2025-03-24', planDias: 15 }, // Plan 15 días
        { id: 123, nombre: 'Francisco Silva', identificacion: '852741963', telefono: '3203334455', fechaInscripcion: '2025-07-02', ultimoPago: '2025-07-02', planDias: 30 },
        { id: 124, nombre: 'Lucía Vargas', identificacion: '741852963', telefono: '3214445566', fechaInscripcion: '2025-04-05', ultimoPago: '2025-04-05', planDias: 30 },
        { id: 125, nombre: 'Miguel Ortiz', identificacion: '963741852', telefono: '3225556677', fechaInscripcion: '2025-03-04', ultimoPago: '2025-03-04', planDias: 15 }, // Plan 15 días
        { id: 126, nombre: 'Sofía Pardo', identificacion: '852963741', telefono: '3236667788', fechaInscripcion: '2025-08-28', ultimoPago: '2025-08-28', planDias: 30 },
        { id: 127, nombre: 'Juan Rojas', identificacion: '741963852', telefono: '3247778899', fechaInscripcion: '2025-04-06', ultimoPago: '2025-04-06', planDias: 30 },
        { id: 128, nombre: 'Ana Soto', identificacion: '963852741', telefono: '3258889900', fechaInscripcion: '2025-03-30', ultimoPago: '2025-03-30', planDias: 15 }, // Plan 15 días
        { id: 129, nombre: 'Pedro Vega', identificacion: '852741963', telefono: '3269990011', fechaInscripcion: '2025-04-08', ultimoPago: '2025-04-08', planDias: 30 },
        { id: 130, nombre: 'Laura Flores', identificacion: '741852963', telefono: '3270001122', fechaInscripcion: '2025-09-01', ultimoPago: '2025-09-01', planDias: 30 }
    ];

    // Procesar los datos - ORDENADOS DE FORMA DESCENDENTE POR ID
    const datosProcesados = datos
        .slice() // Crear una copia del array para no modificar el original
        .sort((a, b) => b.id - a.id) // Ordenar de forma descendente por ID
        .map(item => {
            // Fecha de inscripción es la misma que el último pago (formateada)
            const fechaInscripcionFormateada = formatearFecha(item.ultimoPago);
            // Calcular fecha fin basada en ultimoPago y planDias
            const fin = calcularFechaFin(item.ultimoPago, item.planDias);
            // Calcular estado y días de mora basados en la fecha fin
            const { estado, diasMora } = calcularEstadoYDiasMora(fin);

            return {
                id: item.id,
                nombre: item.nombre,
                identificacion: item.identificacion,
                telefono: item.telefono,
                fechaInscripcion: fechaInscripcionFormateada, // Usar ultimoPago como fecha de inscripción
                ultimoPago: formatearFecha(item.ultimoPago), // Formatear ultimoPago
                planDias: item.planDias,
                vence: fin, // La fecha de vencimiento calculada y formateada
                estado: estado,
                diasMora: diasMora
            };
        });

    // Filtrar datos según el término de búsqueda y el estado
    const datosFiltrados = datosProcesados.filter(item => {
        const nombreSinTildes = quitarTildes(item.nombre.toLowerCase());
        const searchSinTildes = quitarTildes(searchTerm.toLowerCase());
        const searchTermLower = searchTerm.toLowerCase(); // Use lowercase for other fields too

        // Combine searchable fields into a single string for easier searching
        const searchableString = `${nombreSinTildes} ${item.identificacion.toLowerCase()} ${item.telefono.toLowerCase()} ${item.fechaInscripcion.toLowerCase()} ${item.ultimoPago.toLowerCase()} ${item.vence.toLowerCase()} ${item.planDias ? item.planDias.toString() : ''} ${item.diasMora ? item.diasMora.toString() : ''} ${item.estado.toLowerCase()}`;


        const matchesSearch = searchableString.includes(searchSinTildes);
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
                        placeholder="Buscar en la tabla..." // Updated placeholder
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