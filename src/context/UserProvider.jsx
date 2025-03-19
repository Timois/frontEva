/* eslint-disable react/prop-types */
import { createContext, useState } from 'react';
import { getUser, saveUser } from '../services/storage/storageUser';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(getUser());

    const storeUser = (user) => {
        setUser(user);
        saveUser(user);
    };

    const values = { user, storeUser };
    return (
        <UserContext.Provider value={values}>
            {children}
        </UserContext.Provider>
    );
};