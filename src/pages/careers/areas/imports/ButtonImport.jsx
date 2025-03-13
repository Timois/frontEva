/* eslint-disable react/prop-types */
import { FaFileImport } from 'react-icons/fa';

export const ButtonImport = ({ modalIdImp, onClick }) => {
  return (
    <button
      type="button"
      className="btn btn-secondary justify-content-end"
      style={{ backgroundColor: '#5dbf1a', color: 'white', display: 'flex', alignItems: 'center', gap: '5px' }}
      data-bs-toggle="modal"
      data-bs-target={`#${modalIdImp}`}
      onClick={onClick}
    >
      <FaFileImport className="me-2" /> Importar Preguntas
    </button>
  );
};
