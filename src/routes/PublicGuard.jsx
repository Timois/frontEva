
import { Navigate, Outlet } from 'react-router-dom';
import { getToken } from '../services/storage/storage'; // Importa la función para obtener el token JWT

export const PublicGuard = () => {
    const token = getToken(); // Obtiene el token JWT

    // Si hay un token, redirige al usuario a la página de inicio ("/home")
    // Si no hay token, permite el acceso a las rutas públicas (Outlet)
    return token ? <Navigate to="/home" /> : <Outlet />;
};