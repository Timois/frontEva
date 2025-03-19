import { useContext } from "react";
import { StudentContext } from "../context/StudentProvider";
import { getApi } from "../services/axiosServices/ApiService";

export const useFetchStudent = () => {
   const { student, setStudent } = useContext(StudentContext);
    const getData = async () => {
        if (student === null) {
            const response = await getApi("students/list");
            setStudent(response);
        }
        return student;
    }

    return { student, getData }
};