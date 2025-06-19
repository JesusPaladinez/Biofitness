import React from 'react';
import { FaCaretDown } from "react-icons/fa6";

const Table = ({ data, onEstadoFilterChange }) => {
    return (
        <div className="overflow-x-auto overflow-y-auto max-h-[500px] border-1 border-gray-300 rounded-2xl">
            <table className="min-w-full bg-white">
                <thead className='sticky top-0 border-b-1 border-gray-300 z-10'>
                    <tr>
                        <th className="px-6 py-3 border-b-1 border-gray-300 font-semibold text-black text-left whitespace-nowrap">No.</th> 
                        <th className="px-6 py-3 border-b-1 border-gray-300 font-semibold text-black text-left whitespace-nowrap">Nombre</th> 
                        <th className="px-6 py-3 border-b-1 border-gray-300 font-semibold text-black text-left whitespace-nowrap">Teléfono</th> 
                        <th className="px-6 py-3 border-b-1 border-gray-300 font-semibold text-black text-left whitespace-nowrap">Fecha inscripción</th> 
                        <th className="px-6 py-3 border-b-1 border-gray-300 font-semibold text-black text-left whitespace-nowrap">Último pago</th> 
                        <th className="px-6 py-3 border-b-1 border-gray-300 font-semibold text-black text-left whitespace-nowrap">Método de pago</th> 
                        <th className="px-6 py-3 border-b-1 border-gray-300 font-semibold text-black text-left whitespace-nowrap">Administrador</th> 
                        <th className="px-6 py-3 border-b-1 border-gray-300 font-semibold text-black text-left whitespace-nowrap">No. recibo</th> 
                        <th className="px-6 py-3 border-b-1 border-gray-300 font-semibold text-black text-left whitespace-nowrap">Plan</th> 
                        <th className="px-6 py-3 border-b-1 border-gray-300 font-semibold text-black text-left whitespace-nowrap">Vence</th> 
                        <th className="px-6 py-3 border-b-1 border-gray-300 font-semibold text-black text-left whitespace-nowrap">
                            <div className="relative w-full">
                                <select
                                    onChange={(e) => onEstadoFilterChange(e.target.value)}
                                    className="w-full px-2 py-1 pr-8 text-sm rounded-md appearance-none cursor-pointer focus:outline-none focus:ring-1"
                                >
                                    <option value="todos">Estado</option>
                                    <option value="Vigente">Vigente</option>
                                    <option value="Por vencer">Por vencer</option>
                                    <option value="Vencido">Vencido</option>
                                </select>
                                <FaCaretDown className="absolute right-2 top-1/2 -translate-y-1/2 text-black text-xs pointer-events-none" />
                            </div>
                        </th>
                        <th className="px-6 py-3 border-b-1 border-gray-300 font-semibold text-black text-left whitespace-nowrap">Días en mora</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.id} className="hover:bg-purple-50">
                            <td className="px-6 py-4 border-b border-gray-200 whitespace-nowrap">{item.id}</td> 
                            <td className="px-6 py-4 border-b border-gray-200 whitespace-nowrap">{item.nombre}</td> 
                            <td className="px-6 py-4 border-b border-gray-200 whitespace-nowrap">{item.telefono}</td> 
                            <td className="px-6 py-4 border-b border-gray-200 whitespace-nowrap">{item.fechaInscripcion}</td> 
                            <td className="px-6 py-4 border-b border-gray-200 whitespace-nowrap">{item.ultimoPago}</td> 
                            <td className="px-6 py-4 border-b border-gray-200 whitespace-nowrap">{item.metodoPago}</td> 
                            <td className="px-6 py-4 border-b border-gray-200 whitespace-nowrap">{item.responsable}</td> 
                            <td className="px-6 py-4 border-b border-gray-200 whitespace-nowrap">{item.noRecibo}</td> 
                            <td className="px-6 py-4 border-b border-gray-200 whitespace-nowrap">{item.planDias}</td> 
                            <td className="px-6 py-4 border-b border-gray-200 whitespace-nowrap">{item.vence}</td> 
                            <td className="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                                <span className={`px-2 py-1 rounded ${item.estado === 'Vigente' ? 'bg-green-100 text-green-800' :
                                    item.estado === 'Por vencer' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                    {item.estado}
                                </span>
                            </td>
                            <td className="px-6 py-4 border-b border-gray-200 whitespace-nowrap">{item.diasMora}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table; 