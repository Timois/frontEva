import PropTypes from 'prop-types';
import { FaUserCheck } from 'react-icons/fa';

export const ButtonAssign = ({ modalId, persona }) => {
  return (
    <button
      type="button"
      className="btn btn-primary btn-sm ms-2"
      data-bs-toggle="modal"
      data-bs-target={`#${modalId}`}
      data-persona-id={persona.id}
      title="Asignar carrera"
    >
      <FaUserCheck />
    </button>
  );
};

ButtonAssign.propTypes = {
  modalId: PropTypes.string.isRequired,
  persona: PropTypes.object.isRequired
};
