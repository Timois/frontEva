import { useContext } from "react";
import { PermissionsContext } from "../context/PermissionsProvider";
import { getApi } from "../services/axiosServices/ApiService";

export const useFetchPermission = () => {
    const { permisos, setPermisos } = useContext(PermissionsContext);
    const getData = async () => {
        if (permisos.length < 1) {
            const response = await getApi("permissions/list");
            setPermisos(response);
            return response; // Retorna los permisos directamente después de actualizarlos
        }
        return permisos; // Si ya hay permisos, retorna el estado actual
    };

    return { permisos, getData };
};
