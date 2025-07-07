import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye } from "react-icons/fa";

const DetailsButton = ({ userId }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/user-details/${userId}`);
    };

    return (
        <button
            onClick={handleClick}
            className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded-md text-sm font-bold transition-colors duration-200 flex items-center gap-2 cursor-pointer"
        >
            <FaEye className="text-xs" />
            Ver
        </button>
    );
};

export default DetailsButton; 