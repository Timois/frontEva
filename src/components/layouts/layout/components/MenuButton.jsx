import { NavLink } from "react-router-dom";

/* eslint-disable react/prop-types */
export const MenuButton = ({ path, label, onClick }) => (
    <NavLink to={path} className="btn rounded-0 btn-dark w-100 text-start text-uppercase" style={{height:"50px"}} onClick={onClick}>
        {label}
    </NavLink>
);
