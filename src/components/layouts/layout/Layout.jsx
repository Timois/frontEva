/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { useSidebar } from "../../../hooks/useSidebar";
import { Button } from "../../login/Button";
import "./Layout.css";
import { Sidebar, SidebarOpenButton, MenuButton } from "./components";
import { clearStorage, clearStorageStudent } from "../../../services/storage/clearStorage";
import { useContext } from "react";
import { UserContext } from "../../../context/UserProvider";
import { MdLogout } from "react-icons/md";

import { FaUserShield, FaQuestionCircle, FaHome, FaUserGraduate } from "react-icons/fa"; // Ejemplo de íconos

const Layout = ({ children }) => {
  const { user, storeUser } = useContext(UserContext);
  const { student, storeStudent } = useContext(UserContext);
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();
  const navigate = useNavigate();

  // Determinar el tipo de usuario
  const isStudent = !!student;


  const logout = () => {
    if (student) {
      clearStorageStudent(); // Limpia el almacenamiento del estudiante
      storeStudent(null); // Limpia el contexto de estudiantes
    } else {
      clearStorage(); // Limpia el almacenamiento del usuario normal
      storeUser(null); // Limpia el contexto de usuarios
    }

    if (student) {
      navigate("/estudiantes"); // Redirige al login de estudiantes
    } else {
      navigate("/administracion"); // Redirige al login de administradores
    }
  };

  return (
    <div className="d-flex flex-column vh-100">
      <nav className="navbar navbar-dark bg-dark">
        <div className="container-fluid justify-content-end">
          <span className="navbar-brand">{isStudent ? student?.name : user?.name}</span>
          <div style={{ width: "100px" }}>
            <Button
              name="logout"
              type="button"
              onClick={logout}
              icon={<MdLogout size={20} />}
            >
              Cerrar Sesión
            </Button>
          </div>
          <SidebarOpenButton onClick={toggleSidebar} />
        </div>
      </nav>
      <div className="d-flex flex-grow-1 overflow-hidden">
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}>
          <div className="accordion w-100 p-3" id="accordionExample" style={{ backgroundColor: '#82e5ef' }}>
            {/* Sección Administrador - Solo visible para administradores */}
            {!isStudent && (
              <div className="accordion-item" style={{ backgroundColor: '#e4f3bf' }}>
                <h2 className="accordion-header" id="headingOne">
                  <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                    <FaUserShield className="me-2" /> Administrador - X
                  </button>
                </h2>
                <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                  <div className="accordion-body">
                    <MenuButton path={"/administracion/unit"} label={"unidades"} onClick={closeSidebar} />
                    <MenuButton path={"/administracion/careers"} label={"carreras"} onClick={closeSidebar} />
                    <MenuButton path={"/administracion/gestion"} label={"gestiones"} onClick={closeSidebar} />
                    <MenuButton path={"/administracion/periods"} label={"periodos"} onClick={closeSidebar} />
                    <MenuButton path={"/administracion/users"} label={"usuarios"} onClick={closeSidebar} />
                    <MenuButton path={"/administracion/roles"} label={"roles"} onClick={closeSidebar} />
                  </div>
                </div>
              </div>
            )}

            {/* Sección pagina principal */}
            <div className="accordion-item" style={{ backgroundColor: '#e4f3bf' }}>
              <h2 className="accordion-header" id="headingTwo">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                  <FaHome className="me-2" /> Inicio
                </button>
              </h2>
              <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                <div className="accordion-body">
                  {isStudent ? (
                    <MenuButton path={"/estudiantes/home"} label={"inicio"} onClick={closeSidebar} />
                  ) : (
                    <MenuButton path={"/administracion/home"} label={"inicio"} onClick={closeSidebar} />
                  )}
                </div>
              </div>
            </div>

            {/* Sección Docente - Solo visible para administradores */}
            {!isStudent && (
              <div className="accordion-item" style={{ backgroundColor: '#e4f3bf' }}>
                <h2 className="accordion-header" id="headingThree">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                    <FaQuestionCircle className="me-2 w-auto" /> Docentes
                  </button>
                </h2>
                <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                  <div className="accordion-body">
                    <MenuButton path={"/administracion/estudiantes"} label={"Gestion de Estudiantes"} onClick={closeSidebar} />
                    <MenuButton path={"/administracion/questions"} label={"Gestion de Preguntas"} onClick={closeSidebar} />
                    <MenuButton path={"/administracion/examns"} label={"Gestion de Examen"} onClick={closeSidebar} />
                    <MenuButton path={"/administracion/results"} label={"Gestion de Resultados"} onClick={closeSidebar} />
                  </div>
                </div>
              </div>
            )}

            {/* Sección Estudiante */}
            <div className="accordion-item" style={{ backgroundColor: '#e4f3bf' }}>
              <h2 className="accordion-header" id="headingFour">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                  <FaUserGraduate className="me-2 w-auto" /> Estudiantes
                </button>
              </h2>
              <div id="collapseFour" className="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#accordionExample">
                <div className="accordion-body">
                  {isStudent ? (
                    <>
                      <MenuButton path={"/estudiantes/examns"} label={"Iniciar Examen"} onClick={closeSidebar} />
                      <MenuButton path={"/estudiantes/results"} label={"Ver Resultados"} onClick={closeSidebar} />
                    </>
                  ) : (
                    <>
                      <MenuButton path={"/estudiantes/examns"} label={"Gestión de Exámenes"} onClick={closeSidebar} />
                      <MenuButton path={"/estudiantes/results"} label={"Gestión de Resultados"} onClick={closeSidebar} />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Sidebar>
        <div className="pt-4 flex-grow-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;