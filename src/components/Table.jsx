import React from 'react';

const Table = ({ data, onEstadoFilterChange }) => {
    return (
        <div className="overflow-x-auto border-2 border-gray-300 rounded-lg shadow-lg">
            <table className="min-w-full bg-white">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="px-6 py-3 border-b-2 border-gray-300 text-left">ID</th>
                        <th className="px-6 py-3 border-b-2 border-gray-300 text-left">Nombre</th>
                        <th className="px-6 py-3 border-b-2 border-gray-300 text-left">Identificación</th>
                        <th className="px-6 py-3 border-b-2 border-gray-300 text-left">Inicio</th>
                        <th className="px-6 py-3 border-b-2 border-gray-300 text-left">Fin</th>
                        <th className="px-6 py-3 border-b-2 border-gray-300 text-left">
                            <div className="flex flex-col gap-2">
                                <select
                                    onChange={(e) => onEstadoFilterChange(e.target.value)}
                                    className="w-full px-2 py-1 text-sm rounded-md hover:bg-gray-200"
                                >
                                    <option value="todos">Estado</option>
                                    <option value="Vigente">Vigente</option>
                                    <option value="Por vencer">Por vencer</option>
                                    <option value="Vencido">Vencido</option>
                                </select>
                            </div>
                        </th>
                        <th className="px-6 py-3 border-b-2 border-gray-300 text-left">Días de mora</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 border-b border-gray-200">{item.id}</td>
                            <td className="px-6 py-4 border-b border-gray-200">{item.nombre}</td>
                            <td className="px-6 py-4 border-b border-gray-200">{item.identificacion}</td>
                            <td className="px-6 py-4 border-b border-gray-200">{item.inicio}</td>
                            <td className="px-6 py-4 border-b border-gray-200">{item.fin}</td>
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