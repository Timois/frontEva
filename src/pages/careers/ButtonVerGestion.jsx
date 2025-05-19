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
      className="btn btn-sm btn-outline-info d-flex align-items-center p-2 m-2"
      onClick={handleClick}
    >
      {children}
      <FaEye size={16} />
      Ver
    </button>
  );
};

ButtonVerGestion.propTypes = {
  children: PropTypes.node,
  to: PropTypes.string.isRequired,
};
