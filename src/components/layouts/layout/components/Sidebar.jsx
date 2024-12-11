/* eslint-disable react/prop-types */
import "../Layout.css"
import { SidebarCloseButton } from '.'

export const Sidebar = ({ isSidebarOpen, toggleSidebar, children }) => {
    return (
        <div className={`sidebar bg-dark top-0 left-0  text-white vh-100  ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`} style={{ width: '250px', zIndex: 1100 }}>
            <SidebarCloseButton onClick={toggleSidebar} />
            <div className="mt-5">
            {children}
            </div>
        </div>
    )
}
