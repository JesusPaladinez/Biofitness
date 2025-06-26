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

    return (
        <div className="container mx-auto px-8 py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Control de Membresías</h1>
                <div className="flex items-center gap-4">
                    {/* <input
                        type="text"
                        placeholder="Buscar por nombre o teléfono..."
                        className="w-80 px-4 py-2 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    /> */}
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
            {loading ? (
                <div>Cargando...</div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : (
                <Table
                    data={memberships}
                />
            )}
        </div>
    );
};

export default Home;