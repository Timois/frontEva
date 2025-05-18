/* eslint-disable react/prop-types */
import "../Layout.css"
import { SidebarCloseButton } from '.'
import { FaUserShield } from "react-icons/fa";

export const Sidebar = ({ isSidebarOpen, toggleSidebar, children }) => {
    return (
        <div
            className={`sidebar  top-0 start-0 text-white vh-100 
    ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}
            style={{
                zIndex: 1100,
                background: 'linear-gradient(195deg, #1a2d3d, #2c3e50)',
                boxShadow: '4px 0 15px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
        >
            <SidebarCloseButton
                onClick={toggleSidebar}
                className="position-absolute end-0 mt-2 me-3 text-white-50 hover-white"
            />

            <div className="sidebar-header px-4 py-4 border-bottom border-secondary">
                <h3 className="mb-0 d-flex align-items-center">
                    <FaUserShield className="me-2" />
                    <span className="brand-text">Sistema Evaluación</span>
                </h3>
            </div>

            <div className="sidebar-content flex-grow-1 overflow-auto px-3 pt-4">
                {children}
            </div>

            {/* Footer opcional del sidebar */}
            <div className="sidebar-footer p-3 border-top border-secondary text-center">
                <small className="text-white-50">v1.0.0</small>
            </div>
        </div>
    )
}
