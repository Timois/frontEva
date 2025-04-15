/* eslint-disable react/prop-types */
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { PermissionsContext } from "../context/PermissionsProvider";
import Preloader from "../components/common/Preloader"; // Importa tu preloader

const PermissionsGuard = ({
  requiredPermission,
  requiredPermissions,
  requireAll = false,
  redirectTo = "/access-denied",
  children,
}) => {
  const { permissions, isLoading } = useContext(PermissionsContext);

  if (isLoading) {
    return <Preloader />; // ← Muestra el spinner mientras carga
  }

  let hasAccess = false;

  if (requiredPermission) {
    hasAccess = permissions.includes(requiredPermission);
  } else if (requiredPermissions) {
    hasAccess = requireAll
      ? requiredPermissions.every((p) => permissions.includes(p))
      : requiredPermissions.some((p) => permissions.includes(p));
  }

  if (!hasAccess) {
    return <Navigate to={redirectTo} />;
  }

  return children;
};

export default PermissionsGuard;
