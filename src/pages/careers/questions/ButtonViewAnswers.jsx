/* eslint-disable react/prop-types */
import { useNavigate } from 'react-router-dom';
import { MdRemoveRedEye } from 'react-icons/md';

const ButtonViewAnswers = ({ questionId }) => {
    const navigate = useNavigate();

    const handleViewAnswers = () => {
        navigate(`/administracion/questions/${questionId}/answers`);
    };

    return (
        <button
            className="btn btn-info btn-sm"
            onClick={handleViewAnswers}
            title="Ver Respuestas"
        >
            <MdRemoveRedEye /> Ver Respuestas
        </button>
    );
};

export default ButtonViewAnswers;