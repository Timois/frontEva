/* eslint-disable no-unused-vars */

import { useContext } from "react"
import { AnswersContext } from "../context/AnswersProvider"
import { getApi } from "../services/axiosServices/ApiService"

export const useFetchAnswer = () => {
    const { answers, setAnswers } = useContext(AnswersContext);
    
    const getData = async () => {
        if (answers.length < 1) {
            const response = await getApi("bank_answers/list");
            // Extraemos el array de answers de la respuesta
            setAnswers(response.answers || []);
        }
        return answers;
    };
    return { answers, getData };
};

export const useFetchAnswerByIdQuestion = (questionId) => {
    const { answers, setAnswers } = useContext(AnswersContext);
    
    const getAnswer = async (id) => {
        try {
            const response = await getApi(`bank_answers/findByIdQuestion/${id}`);
            return response; // Retornamos la respuesta completa del backend
        } catch (error) {
            console.error('Error fetching answers:', error);
            return { answers: [] };
        }
    };
    
    return { answers, getAnswer };
};