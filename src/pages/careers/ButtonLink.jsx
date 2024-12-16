import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

export const ButtonLink = ({ to, children }) => {
    const navigate = useNavigate();

    const handleClick = (event) => {
        event.preventDefault();
        navigate(to);
    };

    return (
        <button
            type="button"
            className="btn btn-ghost justify-content-end" style={{ backgroundColor: 'transparent', color: '#fa8c07', border: '1px solid #fa8c07' }}
            onClick={handleClick}
        >
            {children}
        </button>
    )
}

ButtonLink.propTypes = {
    children: PropTypes.node,
    to: PropTypes.string.isRequired
}