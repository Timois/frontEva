
import PropTypes from "prop-types";
import { FaEdit } from "react-icons/fa";

/**
 * Botón de edición con ícono
 * 
 * @param {string} idModal - ID del modal a abrir (opcional)
 * @param {function} onClick - Función a ejecutar al hacer click
 * @param {string} label - Texto del botón (opcional)
 * @param {string} className - Clases CSS adicionales
 * @param {object} style - Estilos inline adicionales
 * @param {boolean} showIcon - Mostrar ícono de edición
 * @param {ReactNode} customIcon - Ícono personalizado
 */
const ButtonEdit = ({
  idModal = null,
  onClick = () => {},
  label = "Editar",
  className = "",
  style = {},
  showIcon = true,
  customIcon = null,
  ...props
}) => {
  const handleClick = (e) => {
    e.preventDefault();
    onClick(e); // Ejecuta la función proporcionada
    
    // Si tiene idModal, abre el modal correspondiente
    if (idModal) {
      const modalElement = document.getElementById(idModal);
      if (modalElement) {
        const modal = new window.bootstrap.Modal(modalElement);
        modal.show();
      }
    }
  };

  return (
    <button
      type="button"
      className={`btn btn-primary d-flex align-items-center gap-2 ${className}`}
      style={{ 
        backgroundColor: '#fa8c07', 
        color: 'white',
        ...style 
      }}
      onClick={handleClick}
      {...props}
    >
      {showIcon && (customIcon || <FaEdit size={16} />)}
      {label}
    </button>
  );
};

ButtonEdit.propTypes = {
  idModal: PropTypes.string,
  onClick: PropTypes.func,
  label: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  showIcon: PropTypes.bool,
  customIcon: PropTypes.node,
};

export default ButtonEdit;