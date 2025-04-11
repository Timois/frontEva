/* eslint-disable react/prop-types */
import { useContext } from "react";
import { PermissionsContext } from "../context/PermissionsProvider";
const CheckPermissions = ({ 
  requiredPermission, 
  requiredPermissions, 
  requireAll = false,
  fallback = null, 
  children 
}) => {
  const { permisos } = useContext(PermissionsContext);

  let hasAccess = false;
  if (requiredPermission) {
    // Verificar un solo permiso
    hasAccess = permisos.map(p => 
      p.name.includes(requiredPermission) 
    )
    // includes(requiredPermission);
  } else if (requiredPermissions) {
    // Verificar varios permisos
    if (requireAll) {
      // Necesita tener TODOS los permisos
      hasAccess = requiredPermissions.every(p => permisos.includes(p));
    } else {
      // Necesita tener AL MENOS UN permiso
      hasAccess = requiredPermissions.some(p => permisos.includes(p));
    }
  }

  if (!hasAccess) {
    return fallback;
  }
  
  return children;
};

export default CheckPermissions;