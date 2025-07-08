import { useContext } from "react";
import { PermissionsContext } from "../context/PermissionsProvider";

const CheckPermissions = ({ 
  requiredPermission, 
  requiredPermissions, 
  requireAll = false,
  fallback = null, 
  children 
}) => {
  const { permissions } = useContext(PermissionsContext); // permissions = ['crear-usuarios', 'editar-usuarios', ...]

  let hasAccess = false;
if (requiredPermission) {
  hasAccess = permissions.includes(requiredPermission);
  // console.log("¿Tiene el permiso requerido?", hasAccess);
} else if (requiredPermissions) {
    if (requireAll) {
      // Necesita tener TODOS los permissions
      hasAccess = requiredPermissions.every(p => permissions.includes(p));
    } else {
      // Necesita tener AL MENOS UN permiso
      hasAccess = requiredPermissions.some(p => permissions.includes(p));
    }
  }

  if (!hasAccess) {
    return fallback;
  }

  return children;
};

export default CheckPermissions;
