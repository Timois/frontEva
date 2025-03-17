
import { Navigate, Outlet } from 'react-router-dom';
import { getToken } from '../services/storage/storage'; // Importa la función para obtener el token JWT

export const PrivateGuard = () => {
    const token = getToken(); // Obtiene el token JWT

    // Si hay un token, renderiza las rutas hijas (Outlet)
    // Si no hay token, redirige al usuario a la página de inicio ("/")
    return token ? <Outlet /> : <Navigate to="/" />;
};