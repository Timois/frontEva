/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import { FaEye } from 'react-icons/fa';

export const ViewPeriod = ({ children, handleClick }) => {

    return (
        <button
            type="button"
            className="btn btn-ghost justify-content-end"
            style={{ backgroundColor: '#17a2b8', color: 'white', display: 'flex', alignItems: 'center', gap: '5px' }}
            onClick={handleClick}
            data-bs-toggle="modal"
            data-bs-target={`#verPeriodo`}
        >
            {children}
            <FaEye size={16} /> {/* Ícono de ver */}
            Ver Periodos
        </button>
    )
}

ViewPeriod.propTypes = {
    children: PropTypes.node,
}