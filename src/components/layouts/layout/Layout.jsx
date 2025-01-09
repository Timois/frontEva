/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { useSidebar } from "../../../hooks/useSidebar";
import { Button } from "../../login/Button";
import "./Layout.css";
import { Sidebar, SidebarOpenButton, MenuButton } from "./components";
import { clearStorage } from "../../../services/storage/clearStorage";
import { useContext } from "react";
import { UserContext } from "../../../context/UserProvider";
import { MdLogout } from "react-icons/md";
import { Accordion } from "react-bootstrap";
// eslint-disable-next-line no-unused-vars
import { FaUserShield, FaQuestionCircle, FaHome, FaUserGraduate } from "react-icons/fa"; // Ejemplo de íconos



const Layout = ({ children }) => {
    const { user } = useContext(UserContext);
    const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();
    const navigate = useNavigate();
    const logout = () => {
        clearStorage();
        navigate("/");
    };

    return (
        <div className="d-flex flex-column vh-100">
            <nav className="navbar navbar-dark bg-dark">
                <div className="container-fluid justify-content-end">
                    <span className="navbar-brand">{user?.name}</span>
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
                    <Accordion defaultActiveKey="0" className="w-100 p-3" style={{backgroundColor: '#82e5ef'}}>
                        {/* Sección Administrador */}
                        <Accordion.Item eventKey="0" style={{backgroundColor: '#e4f3bf'}}>
                            <Accordion.Header className="bg-color-success">
                                <FaUserShield className="me-2" /> Administrador
                            </Accordion.Header>
                            <Accordion.Body>
                                <MenuButton path={"/unit"} label={"unidades"} onClick={closeSidebar} />
                                <MenuButton path={"/career"} label={"carreras"} onClick={closeSidebar} />
                                <MenuButton path={"/gestion"} label={"gestiones"} onClick={closeSidebar} />
                                <MenuButton path={"/periods"} label={"periodos"} onClick={closeSidebar} />
                            </Accordion.Body>
                        </Accordion.Item>
                        
                        <Accordion.Item eventKey="1" style={{backgroundColor: '#e4f3bf'}}>
                            <Accordion.Header>
                                <FaHome className="me-2" /> Inicio
                            </Accordion.Header>
                            <Accordion.Body>
                                <MenuButton path={"/home"} label={"inicio"} onClick={closeSidebar} />
                                <MenuButton path={"/"} label={"dashboard"} onClick={closeSidebar} />
                            </Accordion.Body>
                        </Accordion.Item>

                        {/* Sección Exámenes */}
                        <Accordion.Item eventKey="2" style={{backgroundColor: '#e4f3bf'}}>
                            <Accordion.Header>
                                <FaQuestionCircle className="me-2 w-auto" /> Exámenes
                            </Accordion.Header>
                            <Accordion.Body>
                                <MenuButton path={"/"} label={"Categorias"} onClick={closeSidebar}/>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="3" style={{backgroundColor: '#e4f3bf'}}>
                            <Accordion.Header>
                                <FaUserGraduate className="me-2 w-auto" /> Estudiantes
                            </Accordion.Header>
                            <Accordion.Body>
                                <MenuButton path={"/"} label={"Iniciar Examen"} onClick={closeSidebar} />
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Sidebar>
                <div className="pt-4 flex-grow-1 overflow-auto">
                    {children}
                </div>
            </div>

        </div>
    );
};

export default Layout;
