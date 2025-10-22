/* eslint-disable react/prop-types */
import { Link } from "react-router-dom"

export const ButtonViewResults = ({ examnId, places }) => {
    
    return (
        <Link
            to={`/administracion/results/${examnId}`}
            state={{ places }}  // <--- aquí pasamos las plazas
            className="btn btn-primary"
            title="Ver Resultados"
        >
            Ver Resultados
        </Link>
    )
}
