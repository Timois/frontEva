/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import {  saveStudent, getStudent } from "../services/storage/storageStudent";

export const StudentContext = createContext();

export const StudentProvider = ({ children }) => {  
    const [students, setStudents] = useState([]);
    const [student, setStudent] = useState(getStudent());
    useEffect(() => {
        const storedStudent = getStudent();
        if (storedStudent) {
            setStudent(storedStudent);
        } 
    }, []) 
    const storeStudent = (student) => {
        setStudent(student);
        saveStudent(student);
    };

    const addStudent = (student) => {
        setStudents(prev => [...prev, student]);
    };
    const updateStudent = (student) => {
        const posicion = students.findIndex((item) => item.id === student.id);
        if (posicion !== -1) {
            const lista = [...students];
            lista[posicion] = {...lista[posicion], ...student};
            setStudents(lista);
        }
    }
    const values = { students, storeStudent, setStudents , student, setStudent, addStudent, updateStudent};
    return (
        <StudentContext.Provider value={values}>
            {children}
        </StudentContext.Provider>
    );
};
