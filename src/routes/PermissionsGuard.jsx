/* eslint-disable react/prop-types */
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { PermissionsContext } from "../context/PermissionsProvider";

const PermissionsGuard = ({ requiredPermission, requiredPermissions, requireAll = false,
    redirectTo = "/access-denied", children }) => {
    const { permissions } = useContext(PermissionsContext);

    let hasAccess = false;

    if (requiredPermission) {
        // Verificar un solo permiso
        hasAccess = permissions.includes(requiredPermission);
    } else if (requiredPermissions) {
        // Verificar varios permisos
        if (requireAll) {
            // Necesita tener TODOS los permisos
            hasAccess = requiredPermissions.every(p => permissions.includes(p));
        } else {
            // Necesita tener AL MENOS UN permiso
            hasAccess = requiredPermissions.some(p => permissions.includes(p));
        }
    }

    if (!hasAccess) {
        return <Navigate to={redirectTo} />;
    }

    return children;
};

export default PermissionsGuard;