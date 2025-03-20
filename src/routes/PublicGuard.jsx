
import { Navigate, Outlet } from 'react-router-dom';
import { getToken } from '../services/storage/storageUser'; // Importa la función para obtener el token JWT
import { getTokenStudent } from '../services/storage/storageStudent';

export const PublicGuard = () => {
    const token = getToken();
    const tokenStudent = getTokenStudent();
    
    // Si hay un token, redirige según el tipo de usuario
    if (token) {
        return <Navigate to="/administracion/home" />;
    }
    
    if (tokenStudent) {
        return <Navigate to="/students/home" />;
    }
    
    return <Outlet />;
}