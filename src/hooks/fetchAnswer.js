/* eslint-disable no-unused-vars */

import { useContext } from "react"
import { AnswersContext } from "../context/AnswersProvider"
import { getApi } from "../services/axiosServices/ApiService"

export const useFetchAnswer = () => {
    const { answers, setAnswers } = useContext(AnswersContext);

    const getData = async () => {
        const response = await getApi("bank_answers/list");
        setAnswers(response.answers || []);
    };
    return { answers, getData,  };
};

export const useFetchAnswerByIdQuestion = () => {
    const { answers, setAnswers } = useContext(AnswersContext);

    const getAnswer = async (id) => {
        try {
            const response = await getApi(`bank_answers/findByIdQuestion/${id}`);
            setAnswers(response);
        } catch (error) {
            console.error('Error fetching answers:', error);
            return { answers: [] };
        }
    };

    return { answers, getAnswer };
};