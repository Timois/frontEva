/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { FaClipboardList } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


export const ButtonAsignPrueba = ({ examnId }) => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/administracion/examns/${examnId}/prueba`);
    }
    return (
        <button
            type="button"
            className="btn btn-success btn-sm ms-2"
            title="Asignar preguntas"
            onClick={handleClick}
        >
            <FaClipboardList />
        </button>
    )
}
