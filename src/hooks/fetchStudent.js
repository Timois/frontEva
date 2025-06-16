import { useContext } from "react";
import { StudentContext } from "../context/StudentProvider";
import { getApi } from "../services/axiosServices/ApiService";
import { AssignQuestionsContext } from "../context/QuestionEvaluationProvider";
export const useFetchStudent = () => {
    const { students, setStudents } = useContext(StudentContext);

    const getData = async () => {
        if (students.length < 1) {
            const response = await getApi("students/list");
            setStudents(response);
        }
        return students;
    };
    const getStudentsByIdExmans = async (exmanId) => {
        const response = await getApi(`student_tests/list/${exmanId}`);
        setStudents(response);
    }
    
    return { students, getData, getStudentsByIdExmans };
};

export const usFetchStudentTest = () => {
    const { assignQuestions, setAssignQuestions } = useContext(AssignQuestionsContext);

    const getStudentTestById = async (studentTestId) => {
        const response = await getApi(`student_evaluations/questions/${studentTestId}`);
        setAssignQuestions(response)
        return response;
    }
    return { assignQuestions, getStudentTestById };
}