/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { useSidebar } from "../../../hooks/useSidebar"
import { Button } from "../../login/Button";
import "./Layout.css"
import { Sidebar, SidebarOpenButton, MenuButton } from "./components"
import { clearStorage } from "../../../services/storage/clearStorage";
import { useContext } from "react";
import { UserContext } from "../../../context/UserProvider";
import { MdLogout } from "react-icons/md";

const Layout = ({ children }) => {
    const { user } = useContext(UserContext)
    const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();
    const navigate = useNavigate()
    const logout = () => {
        clearStorage()
        navigate("/")
    }
    return (
        <div className="d-flex flex-column vh-100">
            <nav className="navbar navbar-dark bg-dark">
                <div className="container-fluid justify-content-end">
                    <span className="navbar-brand">{user?.name}</span>
                    <div style={{ width: "100px" }}>
                        <Button name="logout" type="button" onClick={logout}  icon={<MdLogout size={20} />} 
                        >Cerrar Sesion</Button>
                    </div>

                    <SidebarOpenButton onClick={toggleSidebar} />
                </div>
            </nav>
            <div className="d-flex flex-grow-1 overflow-hidden">
                <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}>
                    <MenuButton path={"/home"} label={"inicio"} onClick={closeSidebar} />
                    <MenuButton path={"/unit"} label={"unidades"} onClick={closeSidebar} />
                    <MenuButton path={"/career"} label={"carreras"} onClick={closeSidebar} />
                    <MenuButton path={"/gestion"} label={"gestiones"} onClick={closeSidebar} />
                    <MenuButton path={"/periods"} label={"periodos"} onClick={closeSidebar} />

                </Sidebar>
                <div className="pt-4 flex-grow-1 overflow-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Layout;
