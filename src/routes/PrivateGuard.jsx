
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getToken } from '../services/storage/storageUser'; // Importa la función para obtener el token JWT
import { getTokenStudent } from '../services/storage/storageStudent';

export const PrivateGuard = () => {
    const token = getToken();
    const tokenStudent = getTokenStudent();
    const location = useLocation();
    const currentPath = location.pathname;
    
    // Si no hay ningún token, redirige al login correspondiente
    if (!token && !tokenStudent) {
        return <Navigate to="/" />;
    }
    
    // Verifica si es una ruta de estudiantes
    const isStudentRoute = currentPath.startsWith('/students/');
    
    // Verifica si es una ruta de administración
    const isAdminRoute = currentPath.startsWith('/administracion/') || 
                        (currentPath !== '/students/home' && !isStudentRoute);
    
    // Si es una ruta de estudiantes pero el usuario tiene token de admin y no de estudiante
    if (isStudentRoute && token && !tokenStudent) {
        return <Navigate to="/administracion/home" />;
    }
    
    // Si es una ruta de admin pero el usuario tiene token de estudiante y no de admin
    if (isAdminRoute && tokenStudent && !token) {
        return <Navigate to="/students/home" />;
    }
    
    // Si todo está correcto, permite el acceso a las rutas protegidas
    return <Outlet />;
};