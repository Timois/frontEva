/* eslint-disable react/prop-types */

import { AiOutlineEye } from "react-icons/ai";
import { useNavigate } from "react-router-dom";


export const ButtonViewQuestionsAssigned = ({examnId}) => {
    
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/administracion/examns/${examnId}/questionsAssigned`);
    };
  return (
    <button
            type="button"
            className="btn btn-success btn-sm ms-2"
            title="Asignar preguntas"
            onClick={handleClick}
        >
            <AiOutlineEye className="mr-2" />
        </button>
  )
}
