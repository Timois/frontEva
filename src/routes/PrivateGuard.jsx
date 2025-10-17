import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getToken } from '../services/storage/storageUser';
import { getTokenStudent } from '../services/storage/storageStudent';

export const PrivateGuard = () => {
  const token = getToken();              // token de admin/docente
  const tokenStudent = getTokenStudent(); // token de estudiante
  const location = useLocation();
  const currentPath = location.pathname;

  // 🔒 Si no hay ningún token, envía al login general
  if (!token && !tokenStudent) {
    return <Navigate to="/" replace />;
  }

  // 🧭 Detecta el tipo de ruta
  const isStudentRoute = currentPath.startsWith('/estudiantes/');
  const isAdminRoute = currentPath.startsWith('/administracion/');

  // 🚫 Caso 1: estudiante intentando acceder a ruta admin/docente
  if (tokenStudent && !token && isAdminRoute) {
    return <Navigate to="/estudiantes/home" replace />;
  }

  // 🚫 Caso 2: docente/admin intentando acceder a ruta de estudiante
  if (token && !tokenStudent && isStudentRoute) {
    return <Navigate to="/administracion/homeDocente" replace />;
  }

  // ✅ Si todo está correcto, deja pasar
  return <Outlet />;
};
