/* eslint-disable react/prop-types */
import { FaBook } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export const ButtonViewTest = ({studentTestId}) => {
    const navigate = useNavigate();
    const handleClick = () => {
        // Pequeño timeout para permitir que el modal se cierre antes de navegar
        setTimeout(() => {
            navigate(`/administracion/examns/${studentTestId}/prueba`);
        }, 100);
    }
    return (
        <button
            type="button"
            className="btn btn-secondary btn-sm ms-2"
            title="Ver prueba"
            onClick={handleClick}
            data-bs-dismiss="modal"
        >
            <FaBook /> Ver Prueba
        </button>
    )
}
