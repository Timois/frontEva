import { useContext } from "react";
import { StudentContext } from "../context/StudentProvider";
import { getApi } from "../services/axiosServices/ApiService";
export const useFetchStudent = () => {
    const { students, setStudents } = useContext(StudentContext);

    const getData = async () => {
        if (students.length < 1) {
            const response = await getApi("students/list");
            setStudents(response);
        }
        return students;
    };

    const refreshStudents = async () => {
        const response = await getApi("students/list");
        setStudents(response);
    };

    const getTestStudent = async (studentId) => {
        const response = await getApi(`student_evaluations/questions/${studentId}`);
        return response;
    };
    return { students, getData, refreshStudents, getTestStudent };
};
