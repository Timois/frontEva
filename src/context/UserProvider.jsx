/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from 'react';
import { getUser, saveUser } from '../services/storage/storageUser';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState(getUser());;
    useEffect(() => {
        const storedUser = getUser();
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    const addUser = (usuario) => {
        setUsers(prev =>[...prev, usuario]);
    }

    const updateUser = (usuario) => {
        const posicion = users.findIndex(p => p.id === usuario.id)
        if (posicion !== -1) {
            const lista = [...users]
            lista[posicion] = { ...lista[posicion], ...usuario }
            setUsers(lista)
        }
    };
    

    const storeUser = (user) => {
        setUser(user);
        saveUser(user);
    };

    const values = { user, storeUser, users, addUser, updateUser, setUser };
    return (
        <UserContext.Provider value={values}>
            {children}
        </UserContext.Provider>
    );
};