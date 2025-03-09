
import PropTypes from 'prop-types';
import { FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export const ButtonVerGestion = ({ to, children }) => {
    const navigate = useNavigate();

    const handleClick = (event) => {
        event.preventDefault();
        navigate(to);
    };

    return (
        <button
            type="button"
            className="d-flex btn btn-ghost justify-content-end p-2 m-2"
            style={{ backgroundColor: '#17a2b8', color: 'white', display: 'flex', alignItems: 'center', gap: '5px' }}
            onClick={handleClick}
        >
            {children}
            <FaEye size={16} /> {/* Ícono de ver */}
            Ver
        </button>
    )
}

ButtonVerGestion.propTypes = {
    children: PropTypes.node,
    to: PropTypes.string.isRequired
}