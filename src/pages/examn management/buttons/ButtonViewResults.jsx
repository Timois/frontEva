/* eslint-disable react/prop-types */
import { Link } from "react-router-dom"

export const ButtonViewResults = ({ examnId }) => {
    return (
        <Link to={`/results/${examnId}`} className="btn btn-primary" title="Ver Resultados">
            Ver Resultados
        </Link>
    )
}
