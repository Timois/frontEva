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
  const [permissions, setpermissions] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // ⬅️ nuevo estado

  useEffect(() => {
    // Simular carga o simplemente cargar directamente
    const stored = loadPermissions();
    setpermissions(stored);
    setIsLoading(false); // ⬅️ ya terminó de cargar
  }, []);

  useEffect(() => {
    if (permissions.length > 0) {
      localStorage.setItem("permissions", JSON.stringify(permissions));
    }
  }, [permissions]);

  const values = {
    permissions,
    setpermissions,
    permisos,
    setPermisos,
    isLoading, // ⬅️ pasamos isLoading al contexto
  };

  return (
    <PermissionsContext.Provider value={values}>
      {children}
    </PermissionsContext.Provider>
  );
};
