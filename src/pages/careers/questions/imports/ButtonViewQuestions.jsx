/* eslint-disable react/prop-types */
import { FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";

export const ButtonViewQuestions = ({idExcel}) => {

    return (
        <Link 
        to={`${idExcel}/questions`} 
        className="btn btn-sm btn-outline-info d-flex align-items-center p-2 m-2">
            <FaEye />
            Ver preguntas
        </Link>
    )
}
