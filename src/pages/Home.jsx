import React, { useState, useEffect } from 'react';
import Table from '../components/Table';
import { GoArrowRight } from "react-icons/go";
import { useNavigate } from 'react-router-dom';
import { membershipService } from '../services/membershipService';
import { planService } from '../services/planService';
import { paymentMethodService } from '../services/paymentMethodService';
import { userService } from '../services/userService';
import { stateService } from '../services/stateService';


const Home = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [estadoFilter, setEstadoFilter] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [memberships, setMemberships] = useState([]);
    const [plans, setPlans] = useState([]);
    const [methods, setMethods] = useState([]);
    const [estates, setEstates] = useState([]);
    const [users, setUsers] = useState([]);

    // Función para formatear la fecha al formato dd/mm/yyyy
    const formatearFecha = (fecha) => {
        if (!fecha) return '';
        const date = new Date(fecha);
        const dia = date.getDate();
        const mes = (date.getMonth() + 1).toString().padStart(2, '0');
        const año = date.getFullYear();
        return `${dia}/${mes}/${año}`;
    };

    // Función para calcular la fecha fin basada en el plan (15 o 30 días)
    const calcularFechaFin = (fechaInicio, planDias) => {
        if (!fechaInicio || !planDias) return '';
        const fecha = new Date(fechaInicio);
        fecha.setDate(fecha.getDate() + (planDias - 1));
        return formatearFecha(fecha);
    };

    // Función para calcular el estado y días de mora
    const calcularEstadoYDiasMora = (fechaFin) => {
        if (!fechaFin) return { estado: 'Sin estado', diasMora: "" };

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



    // Cargar datos de la API
    useEffect(() => {
        const fetchMemberships = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await membershipService.getAllWithDetails();
                setMemberships(data);
            } catch (error) {
                console.error('Error al cargar membresías:', error);
                setError('Error al cargar los datos. Por favor, inténtalo de nuevo.');
            } finally {
                setLoading(false);
            }
        };

        fetchMemberships();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const [plansData, methodsData, estatesData, usersData] = await Promise.all([
                planService.getAll(),
                paymentMethodService.getAll(),
                stateService.getAll(),
                userService.getAll()
            ]);
            setPlans(plansData);
            setMethods(methodsData);
            setEstates(estatesData);
            setUsers(usersData);
        };
        fetchData();
    }, []);

    // Procesar los datos de la API
    const datosProcesados = memberships
        .slice()
        .sort((a, b) => b.id_membership - a.id_membership)
        .map(item => {
            const fechaInscripcion = formatearFecha(item.user?.created_at);
            const ultimoPago = formatearFecha(item.last_payment);
            const vence = calcularFechaFin(item.last_payment, item.plan?.days_duration);
            const { estado, diasMora } = calcularEstadoYDiasMora(vence);

            return {
                id: item.id_membership,
                noRecibo: item.receipt_number,
                nombre: item.user?.name_user || 'Sin nombre',
                telefono: item.user?.phone || 'Sin teléfono',
                fechaInscripcion,
                ultimoPago,
                metodoPago: item.payment_method?.name_method || 'Sin método',
                responsable: item.user?.manager?.name_manager || 'Sin responsable',
                planDias: item.plan?.days_duration || 0,
                vence,
                estado,
                diasMora,
                estate: item.estate?.name_estate || 'Sin estado'
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

    if (loading) {
        return (
            <div className="container mx-auto px-8 py-10">
                <div className="flex justify-center items-center h-64">
                    <div className="text-xl text-gray-600">Cargando datos...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-8 py-10">
                <div className="flex justify-center items-center h-64">
                    <div className="text-xl text-red-600">{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-8 py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Control de Membresías</h1>
                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        placeholder="Buscar por nombre o teléfono..."
                        className="w-80 px-4 py-2 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                        className="group bg-purple-800 text-white hover:text-white font-semibold py-2 px-4 rounded-lg transition-colors cursor-pointer"
                        onClick={() => navigate('/registration')}
                    >
                        <span className="flex items-center gap-2">
                            Inscribir
                            <GoArrowRight className="hidden group-hover:inline text-2xl" />
                        </span>
                    </button>
                </div>
            </div>
            <p className='m-4'>Example: {users.length > 0 ? users[0].name_user : 'Cargando usuarios...'}</p>
            <Table
                data={datosFiltrados}
                onEstadoFilterChange={setEstadoFilter}
            />
        </div>
    );
};

export default Home;