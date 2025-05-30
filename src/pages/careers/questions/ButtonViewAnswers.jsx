/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import { MdRemoveRedEye } from 'react-icons/md';

const ButtonViewAnswers = ({ questionId }) => {

    return (
        <Link
            to={`/administracion/questions/${questionId}/answers`}
            className="btn btn-info btn-sm"
            title="Ver Respuestas"
        >
            <MdRemoveRedEye /> Ver Respuestas
        </Link>
    );
};

export default ButtonViewAnswers;