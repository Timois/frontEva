/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from "react";

// Función para cargar los permissions desde localStorage
const loadPermissions = () => {
  const storedPermissions = localStorage.getItem("permissions");
  return storedPermissions ? JSON.parse(storedPermissions) : [];
};

export const PermissionsContext = createContext();

export const PermissionsProvider = ({ children }) => {
  // Inicializar los permissions cargándolos del localStorage
  const [permissions, setpermissions] = useState(loadPermissions());
  const [permisos, setPermisos] = useState([]);
  // Sincronizar los permissions con el localStorage cuando cambian
  useEffect(() => {
    if (permissions.length > 0) {
      localStorage.setItem("permissions", JSON.stringify(permissions));
    }
  }, [permissions]);


  const values = { permissions, setpermissions, permisos, setPermisos};

  return (
    <PermissionsContext.Provider value={values}>
      {children}
    </PermissionsContext.Provider>
  );
};
