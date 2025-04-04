import axios from "axios";
import { getToken } from "../storage/storageUser";
import { clearStorage, clearStorageStudent } from "../storage/clearStorage";

const path = import.meta.env.VITE_API_ENDPOINT;

// Variable para controlar redirecciones
let isRedirecting = false;

// Lista de rutas públicas que no requieren verificación de token
const publicRoutes = [
  "/login", 
  // Añade aquí cualquier otra ruta pública
];

// Función para determinar si la URL actual es una ruta pública
const isPublicRoute = () => {
  const currentPath = window.location.pathname;
  return publicRoutes.some(route => currentPath.includes(route));
};

// Función para manejar el logout cuando el token expira
const handleTokenExpiration = () => {
  // Si ya estamos en una ruta pública o redirigiendo, no hacer nada
  if (isPublicRoute() || isRedirecting) return;
  
  isRedirecting = true;
  console.log("Token expirado, redirigiendo...");
  
  // Determinar si es un estudiante o administrador
  const isStudent = !!localStorage.getItem("student");
  
  // Limpiar almacenamiento
  if (isStudent) {
    clearStorageStudent();
  } else {
    clearStorage();
  }
  
  // Redirigir según el tipo de usuario
  setTimeout(() => {
    window.location.href = isStudent ? "/estudiantes" : "/administracion";
    isRedirecting = false;
  }, 100);
};

// Función para verificar si el token JWT sigue siendo válido
export const isTokenValid = () => {
  // Si estamos en una ruta pública, no validar el token
  if (isPublicRoute()) return true;
  
  const token = getToken();
  
  if (!token) {
    return false;
  }
  
  try {
    // Decodificar el token
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    
    // Verificar la expiración
    const currentTime = Date.now() / 1000;
    return payload.exp > currentTime;
  } catch (error) {
    console.error("Error al validar el token:", error);
    return false;
  }
};

// Función para realizar solicitudes GET
export const getApi = async (url) => {
    // Si estamos en una ruta pública, no verificar el token
    if (!isPublicRoute() && !isTokenValid()) {
        handleTokenExpiration();
        throw new Error("Token expirado");
    }

    const token = getToken();
    
    // Si no hay token y no es una ruta pública, manejar la expiración
    if (!token && !isPublicRoute()) {
        handleTokenExpiration();
        throw new Error("Token no encontrado");
    }

    try {
        const headers = {};
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }
        
        const { data } = await axios.get(path + url, { headers });
        return data;
    } catch (error) {
        console.error("Error en la respuesta:", error);
        console.log(error.response.status);
        // Si el error es 401 o 403 y no estamos en una ruta pública, manejar expiración del token
        if (error.response?.status === 401 || error.response?.status === 403) {
            handleTokenExpiration();
        }

        throw error;
    }
};

// Función para realizar solicitudes POST
export const postApi = async (url, values) => {
    // Si estamos en una ruta de login/registro, no verificar el token
    const isAuthRoute = url.includes('login') || url.includes('register');
    
    // Solo verificar el token para rutas protegidas
    if (!isAuthRoute && !isPublicRoute() && !isTokenValid()) {
        handleTokenExpiration();
        throw new Error("Token expirado");
    }

    const token = getToken();
    
    try {
        const headers = {
            "Content-Type": "multipart/form-data"
        };
        
        // Solo incluir Authorization si hay un token y no es una ruta de auth
        if (token && !isAuthRoute) {
            headers.Authorization = `Bearer ${token}`;
        }
        
        const { data } = await axios.post(path + url, values, { headers });
        return data;
    } catch (error) {
        console.error("Error en la respuesta:", error);

        // Solo manejar la expiración del token para rutas protegidas
        if ((error.response?.status === 401 || error.response?.status === 403) && !isAuthRoute && !isPublicRoute()) {
            handleTokenExpiration();
        }

        throw error;
    }
};