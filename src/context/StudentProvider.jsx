/* eslint-disable react/prop-types */
import { createContext, useState } from "react";
import { getStudent, saveStudent } from "../services/storage/storageStudent";

export const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
    const [student, setStudent] = useState(getStudent());

    const storeStudent = (student) => {
        setStudent(student);
        saveStudent(student);
    };

    const values = { student, storeStudent };
    return (
        <StudentContext.Provider value={values}>
            {children}
        </StudentContext.Provider>
    );
};
