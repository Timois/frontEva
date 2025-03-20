/* eslint-disable react/prop-types */
import { createContext, useState } from "react";
import {  saveStudent } from "../services/storage/storageStudent";

export const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
    const [students, setStudents] = useState([]);
   
    const storeStudent = (student) => {
        setStudents(student);
        saveStudent(student);
    };

    const values = { students, storeStudent, setStudents };
    return (
        <StudentContext.Provider value={values}>
            {children}
        </StudentContext.Provider>
    );
};
