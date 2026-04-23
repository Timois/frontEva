/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";

export const Button = ({ type, name, children, icon = null, disable = false, onClick, fullWidth = true }) => {
    return (
        <button
            onClick={onClick}
            type={type}
            name={name}
            disabled={disable}
            className={`btn rounded-0 d-flex align-items-center justify-content-center ${fullWidth ? "w-100" : ""}`}
            style={{ backgroundColor: "#070785", color: "white" }}
        >
            {icon && <span className="me-2">{icon}</span>} {/* Renderiza el ícono antes del texto */}
            {children}
        </button>
    );
};
