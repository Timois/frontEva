import PropTypes from "prop-types";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


export const ButtonVerAreas = ({ to, children }) => {
    const navigate = useNavigate();

    const handleClick = (event) => {
        event.preventDefault();
        navigate(to);
    };
    return (
        <button
            type="button"
            className="btn btn-ghost justify-content-end"
            style={{ backgroundColor: '#17a2b8', color: 'white', display: 'flex', alignItems: 'center', gap: '5px' }}
            onClick={handleClick}
        >
            {children}
            <FaEye size={16} /> {/* Ícono de ver */}
            Ver Areas
        </button>
    )
}
ButtonVerAreas.propTypes = {
    children: PropTypes.node,
    to: PropTypes.string.isRequired
}