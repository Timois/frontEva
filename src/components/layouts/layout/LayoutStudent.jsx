/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { Button } from "../../login/Button";
import "./Layout.css";
import { clearStorageStudent } from "../../../services/storage/clearStorage";
import { useContext } from "react";
import { MdLogout } from "react-icons/md";
import { StudentContext } from "../../../context/StudentProvider";
const LayoutStudent = ({ children }) => {
  // Contexts
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
      <nav className="navbar navbar-dark bg-dark">
        <div className="container-fluid justify-content-between">
          <span className="navbar-brand">{student?.name}</span>
          <div>
            <Button
              name="logout"
              type="button"
              onClick={logout}
              icon={<MdLogout size={20} />}
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </nav>

      <div className="container-fluid flex-grow-1 overflow-auto p-4">
        {children}
      </div>
    </div>
  );
};

export default LayoutStudent;
