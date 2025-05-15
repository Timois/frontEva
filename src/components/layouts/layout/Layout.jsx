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
  const isStudent = Boolean(student); // Cambiado de !!student a Boolean(student)

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
            {hasAnyAdminPermission() && (
              <div className="accordion-item" style={{ backgroundColor: '#fdfefe' }}>
                <h2 className="accordion-header" id="headingOne">
                  <button
                    className="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseOne"
                    aria-expanded="true"
                    aria-controls="collapseOne"
                  >
                    <FaUserShield className="me-2" /> Administracion
                  </button>
                </h2>
                <div
                  id="collapseOne"
                  className="accordion-collapse collapse show"
                  aria-labelledby="headingOne"
                >
                  <div className="accordion-body">
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
            {(
              <div className="accordion-item" style={{ backgroundColor: '#fdfefe' }}>
                <h2 className="accordion-header" id="headingThree">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                    <FaQuestionCircle className="me-2 w-auto" /> Evaluaciones
                  </button>
                </h2>
                <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree">
                  <div className="accordion-body">
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

            {(
              <div className="accordion-item" style={{ backgroundColor: '#fdfefe' }}>
                <h2 className="accordion-header" id="headingFour">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                    <FaUserGraduate className="me-2 w-auto" /> Estudiantes
                  </button>
                </h2>
                <div id="collapseFour" className="accordion-collapse collapse" aria-labelledby="headingFour">
                  <div className="accordion-body">
                    <MenuButton path={"/estudiantes/home"} label={"Inicio"} onClick={closeSidebar} />
                    <MenuButton path={"/estudiantes/examns"} label={"Iniciar Examen"} onClick={closeSidebar} />
                    <MenuButton path={"/estudiantes/results"} label={"Ver Resultados"} onClick={closeSidebar} />
                  </div>
                </div>
              </div>
            )}

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
