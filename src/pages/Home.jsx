import React, { useState, useEffect } from 'react';
import Table from '../components/Table';
import { GoArrowRight } from "react-icons/go";
import { useNavigate } from 'react-router-dom';
import { membershipService } from '../services/membershipService';

const Home = () => {
    const navigate = useNavigate();
    const [memberships, setMemberships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedState, setSelectedState] = useState("todos");
    const [selectedPlan, setSelectedPlan] = useState("todos");

    // Normaliza texto: minúsculas, sin tildes, sin caracteres especiales
    const normalize = (str) =>
        (str || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/\u0300-\u036f/g, "") // quita tildes
            .replace(/[^a-z0-9]/gi, ""); // quita caracteres especiales

    useEffect(() => {
        const fetchMemberships = async () => {
            try {
                const data = await membershipService.getAllWithDetails();
                setMemberships(data);
            } catch (err) {
                setError('Error al cargar membresías');
            } finally {
                setLoading(false);
            }
        };
        fetchMemberships();
    }, []);

    // Extrae los estados únicos de los datos de membresía
    const uniqueStates = [
        ...new Set(memberships.map(m => m.name_state).filter(Boolean))
    ];
    // Extrae los planes únicos de los datos de membresía
    const uniquePlans = [
        ...new Set(memberships.map(m => m.days_duration).filter(Boolean))
    ];

    return (
        <div className="container mx-auto px-8 py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Control de Membresías</h1>
                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        placeholder="Buscar por nombre o teléfono..."
                        className="w-80 px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                        className="group bg-purple-800 text-white hover:text-white font-semibold py-2 px-4 rounded-lg transition-colors cursor-pointer"
                        onClick={() => navigate('/inscribir-usuario')}
                    >
                        <span className="flex items-center gap-2">
                            Inscribir
                            <GoArrowRight className="hidden group-hover:inline text-2xl" />
                        </span>
                    </button>
                </div>
            </div>
            {loading ? (
                <div>Cargando...</div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : (
                <Table
                    data={memberships.filter(m => {
                        const nombre = normalize(m.name_user);
                        const telefono = normalize(m.user_phone);
                        const term = normalize(searchTerm);
                        const stateMatch = selectedState === "todos" || m.name_state === selectedState;
                        const planMatch = selectedPlan === "todos" || m.days_duration === parseInt(selectedPlan);
                        return (nombre.includes(term) || telefono.includes(term)) && stateMatch && planMatch;
                    })}
                    states={uniqueStates}
                    selectedState={selectedState}
                    onStateChange={setSelectedState}
                    plans={uniquePlans}
                    selectedPlan={selectedPlan}
                    onPlanChange={setSelectedPlan}
                />
            )}
        </div>
    );
};

export default Home;