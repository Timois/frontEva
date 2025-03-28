/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from "react";
import { getApi } from "../services/axiosServices/ApiService";

export const RolContext = createContext();

export const RolesProvider = ({ children }) => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Función para cargar los roles desde la API
    const loadRoles = async () => {
        setLoading(true);
        try {
            const response = await getApi("roles/list");
            setRoles(response.data || response); // Dependiendo de cómo venga la respuesta
            setError(null);
        } catch (err) {
            setError("Error al cargar los roles");
            console.error("Error loading roles:", err);
        } finally {
            setLoading(false);
        }
    };

    // Cargar roles al montar el componente
    useEffect(() => {
        loadRoles();
    }, []);

    const addRol = (rol) => {
        setRoles([...roles, rol]);
    };

    const updateRol = (rol) => {
        setRoles(prevRoles => 
            prevRoles.map(r => r.id === rol.id ? rol : r)
        );
    };

    const deleteRol = (id) => {
        setRoles(prevRoles => prevRoles.filter(r => r.id !== id));
    };

    const getRolById = (id) => {
        return roles.find(r => r.id === id);
    };

    const values = { 
        roles, 
        loading, 
        error,
        addRol, 
        updateRol, 
        deleteRol,
        getRolById,
        reloadRoles: loadRoles
    };

    return (
        <RolContext.Provider value={values}>
            {children}
        </RolContext.Provider>
    );
};