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
import { FaUserShield, FaQuestionCircle, FaUserGraduate } from "react-icons/fa";
import { PermissionsContext } from "../../../context/PermissionsProvider";
import { StudentContext } from "../../../context/StudentProvider";

const Layout = ({ children }) => {
  // Contexts
  const { user, storeUser } = useContext(UserContext);
  const { permissions, isLoading } = useContext(PermissionsContext);
  const { student, storeStudent } = useContext(StudentContext);
  // Hooks
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();
  const navigate = useNavigate();

  // Variables
  const isStudent = Boolean(!student); // Cambiado de !!student a Boolean(student)

  const logout = () => {
    try {
      if (student) {
        clearStorageStudent();
        storeStudent(null);
        navigate("/estudiantes");
      } else {
        clearStorage();
        storeUser(null);
        navigate("/login");
      }
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  if (isLoading) {
    return <div className="text-center mt-10">Cargando Layout...</div>;
  }
  const hasPermission = (permission) => {
    return permissions.includes(permission);
  };
  // Agregar esta función para verificar permisos de administración
  const hasAnyAdminPermission = () => {
    const adminPermissions = [
      "ver-usuarios",
      "ver-roles",
      "ver-unidades-por-id",
      "ver-unidades-academicas",
      "ver-carreras",
      "ver-gestiones",
      "ver-periodos"
    ];
    return adminPermissions.some(perm => permissions.includes(perm));
  };
  // Add this function near the other permission checks
  const hasAnyEvaluationPermission = () => {
    const evaluationPermissions = [
      "ver-areas",
      "ver-postulantes",
      "ver-preguntas",
      "ver-evaluaciones"
    ];
    return evaluationPermissions.some(perm => permissions.includes(perm));
  };

  return (
    <div className="d-flex flex-column vh-100">
      {/* Navbar mejorado */}
      <nav className="navbar navbar-dark bg-primary shadow-sm py-3">
        <div className="container-fluid">
          <div className="d-flex align-items-center">
            <span className="navbar-brand mb-0 h6 ms-3 text-truncate">
              <FaUserShield className="me-2" />
              {isStudent ? student?.name : user?.name}
            </span>
          </div>

          <div className="d-flex align-items-center">
            <button
              onClick={logout}
              className="btn btn-link text-light text-decoration-none"
              title="Cerrar sesión"
            >
              <MdLogout size={24} />
            </button>
          </div>
        </div>
      </nav>

      <div className="d-flex flex-grow-1 overflow-hidden">
        <Sidebar isSidebarOpen={true} toggleSidebar={toggleSidebar}>
          <div className="accordion w-100 p-2 custom-sidebar">
            {hasAnyAdminPermission() && (
              <div className="accordion-item border-0 mb-2">
                <h2 className="accordion-header" id="headingOne">
                  <button
                    className="accordion-button rounded-3 shadow-none bg-light"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseOne"
                  >
                    <FaUserShield className="me-3 text-primary" />
                    <span className="fw-medium">Administración</span>
                  </button>
                </h2>
                <div
                  id="collapseOne"
                  className="accordion-collapse collapse show"
                >
                  <div className="accordion-body p-0">
                    {hasPermission("ver-usuarios") && (
                      <MenuButton
                        path={"/administracion/users"}
                        label={"Usuarios"}
                        onClick={closeSidebar}
                      />
                    )}
                    {hasPermission("ver-roles") && (
                      <MenuButton
                        path={"/administracion/roles"}
                        label={"Roles"}
                        onClick={closeSidebar}
                      />
                    )}
                    {hasPermission("ver-unidades-por-id") && (
                      <MenuButton
                        path={"/administracion/career"}
                        label={"Carrera"}
                        onClick={closeSidebar}
                      />
                    )}
                    {hasPermission("ver-unidades-academicas") && (
                      <MenuButton
                        path={"/administracion/unit"}
                        label={"Unidades"}
                        onClick={closeSidebar}
                      />
                    )}
                    {hasPermission("ver-carreras") && (
                      <MenuButton
                        path={"/administracion/careers"}
                        label={"Carreras"}
                        onClick={closeSidebar}
                      />
                    )}

                    {hasPermission("ver-gestiones") && (
                      <MenuButton
                        path={"/administracion/gestion"}
                        label={"Gestiones"}
                        onClick={closeSidebar}
                      />
                    )}
                    {hasPermission("ver-periodos") && (
                      <MenuButton
                        path={"/administracion/periods"}
                        label={"Periodos"}
                        onClick={closeSidebar}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}

            {hasAnyEvaluationPermission() && (
              <div className="accordion-item border-0 mb-2">
                <h2 className="accordion-header" id="headingThree">
                  <button className="accordion-button rounded-3 shadow-none bg-light collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                    <FaQuestionCircle className="me-3 text-primary" />
                    <span className="fw-medium">Evaluaciones</span>
                  </button>
                </h2>
                <div id="collapseThree" className="accordion-collapse collapse">
                  <div className="accordion-body p-0">
                    <MenuButton path={"/administracion/home"} label={"Inicio"} onClick={closeSidebar} />
                    {hasPermission("ver-areas") && (
                      <MenuButton path={"/administracion/areas"} label={"Areas"} onClick={closeSidebar} />
                    )}
                    {hasPermission("ver-postulantes") && (
                      <MenuButton path={"/administracion/estudiantes"} label={"Estudiantes"} onClick={closeSidebar} />
                    )}
                    {hasPermission("ver-preguntas") && (
                      <MenuButton path={"/administracion/questions"} label={"Preguntas"} onClick={closeSidebar} />
                    )}
                    {hasPermission("ver-evaluaciones") && (
                      <MenuButton path={"/administracion/examns"} label={"Examenes"} onClick={closeSidebar} />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Sidebar>

        {/* Contenido principal */}
        <div className="flex-grow-1 overflow-auto bg-light p-4">
          <div className="container-fluid bg-white rounded-3 shadow-sm p-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
