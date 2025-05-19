/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { clearStorageStudent } from "../../../services/storage/clearStorage";
import { useContext } from "react";
import { MdLogout } from "react-icons/md";
import { StudentContext } from "../../../context/StudentProvider";

const LayoutStudent = ({ children }) => {
  const { student, storeStudent } = useContext(StudentContext);
  const navigate = useNavigate();

  const logout = () => {
    try {
      clearStorageStudent();
      storeStudent(null);
      navigate("/estudiantes");
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="d-flex flex-column vh-100">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm px-4">
        <div className="container-fluid justify-content-between">
          <span className="navbar-brand fw-semibold text-truncate">
            👨‍🎓 {student?.name || "Estudiante"}
          </span>
          <button
            onClick={logout}
            className="btn btn-outline-light d-flex align-items-center"
            title="Cerrar sesión"
          >
            <MdLogout size={20} className="me-2" />
            Cerrar Sesión
          </button>
        </div>
      </nav>

      <div className="container-fluid flex-grow-1 overflow-auto bg-light py-4 px-3">
        <div className="bg-white rounded-3 shadow-sm p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default LayoutStudent;
