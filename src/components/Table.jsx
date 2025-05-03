import React from 'react';
import { FaCaretDown } from "react-icons/fa6";

const Table = ({ data, onEstadoFilterChange }) => {
    return (
        <div className="overflow-x-auto border-1 border-gray-300 rounded-lg shadow-lg">
            <table className="min-w-full bg-white">
                <thead> 
                    <tr className="bg-purple-100">
                        <th className="px-6 py-3 border-b-1 border-gray-300 text-left">ID</th>
                        <th className="px-6 py-3 border-b-1 border-gray-300 text-left">Nombre</th>
                        <th className="px-6 py-3 border-b-1 border-gray-300 text-left">Identificación</th>
                        <th className="px-6 py-3 border-b-1 border-gray-300 text-left">Teléfono</th>
                        <th className="px-6 py-3 border-b-1 border-gray-300 text-left">Fecha Inscripción</th>
                        <th className="px-6 py-3 border-b-1 border-gray-300 text-left">Último pago</th>
                        <th className="px-6 py-3 border-b-1 border-gray-300 text-left">Plan (Días)</th>
                        <th className="px-6 py-3 border-b-1 border-gray-300 text-left">Vence</th>
                        <th className="px-6 py-3 border-b-1 border-gray-300 text-left">
                            <div className="relative w-full">
                                <select
                                    onChange={(e) => onEstadoFilterChange(e.target.value)}
                                    className="w-full px-2 py-1 pr-8 text-sm rounded-md hover:bg-purple-200 appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-purple-300"
                                >
                                    <option value="todos">Estado</option>
                                    <option value="Vigente">Vigente</option>
                                    <option value="Por vencer">Por vencer</option>
                                    <option value="Vencido">Vencido</option>
                                </select>
                                <FaCaretDown className="absolute right-2 top-1/2 -translate-y-1/2 text-black text-xs pointer-events-none" />
                            </div>
                        </th>
                        <th className="px-6 py-3 border-b-1 border-gray-300 text-left">Días de mora</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 border-b border-gray-200">{item.id}</td>
                            <td className="px-6 py-4 border-b border-gray-200">{item.nombre}</td>
                            <td className="px-6 py-4 border-b border-gray-200">{item.identificacion}</td>
                            <td className="px-6 py-4 border-b border-gray-200">{item.telefono}</td>
                            <td className="px-6 py-4 border-b border-gray-200">{item.fechaInscripcion}</td>
                            <td className="px-6 py-4 border-b border-gray-200">{item.ultimoPago}</td>
                            <td className="px-6 py-4 border-b border-gray-200">{item.planDias}</td>
                            <td className="px-6 py-4 border-b border-gray-200">{item.vence}</td>
                            <td className="px-6 py-4 border-b border-gray-200">
                                <span className={`px-2 py-1 rounded ${item.estado === 'Vigente' ? 'bg-green-100 text-green-800' :
                                    item.estado === 'Por vencer' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                    {item.estado}
                                </span>
                            </td>
                            <td className="px-6 py-4 border-b border-gray-200">{item.diasMora}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table; 