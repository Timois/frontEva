import { postApi } from '../axiosServices/ApiService';

export const storageAnswers = async (respuesta, studentTestId, timeLeft) => {
    try {
        // Guardar en almacenamiento de sesión
        const respuestasActuales = getAnswers();
        const respuestasActualizadas = {
            ...respuestasActuales,
            [respuesta.questionId]: {
                questionId: respuesta.questionId,
                answerId: respuesta.answerId,
                timeLeft,
                timestamp: new Date().toISOString()
            }
        };
        window.sessionStorage.setItem("answers", JSON.stringify(respuestasActualizadas));

        // Guardar en la base de datos
        const payload = {
            student_test_id: studentTestId,
            question_id: respuesta.questionId,
            answer_id: respuesta.answerId,
            time: timeLeft
        };
        try {
            await postApi('backup_answers/save', payload);
        }catch (error) {
            console.error('Error al guardar la respuesta en la base de datos:', error);
        } // No esperar a que se complete la petición de guardado de respuest

        return true;
    } catch (error) {
        console.error('Error al guardar la respuesta:', error);
        return false;
    }
};

export const getAnswers = () => {
    const data = window.sessionStorage.getItem("answers");
    return data ? JSON.parse(data) : {};
};

export const limpiarRespuestas = () => {
    window.sessionStorage.removeItem("answers");
};

export const recuperarRespuestasGuardadas = async (studentTestId) => {
    try {
        const respuestas = await postApi(`backup_answers/find/${studentTestId}`);
        if (respuestas?.length > 0) {
            const respuestasFormateadas = respuestas.reduce((acc, respuesta) => ({
                ...acc,
                [respuesta.question_id]: {
                    questionId: respuesta.question_id,
                    answerId: respuesta.answer_id,
                    timeLeft: respuesta.time
                }
            }), {});
            window.sessionStorage.setItem("answers", JSON.stringify(respuestasFormateadas));
            return respuestasFormateadas;
        }
        return {};
    } catch (error) {
        console.error('Error al recuperar respuestas:', error);
        return {};
    }
};