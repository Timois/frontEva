/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// SidebarToggleButton.jsx
import React from "react";

export const SidebarOpenButton = ({ onClick }) => (
    <button
        className="navbar-toggler d-md-none"
        type="button"
        onClick={onClick}
    >
        <span className="navbar-toggler-icon"></span>
    </button>
);
