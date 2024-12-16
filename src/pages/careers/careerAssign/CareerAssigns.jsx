import PropTypes from 'prop-types'

export const CareerAssigns = ({ data }) => {
    return (
        <div className="w-100">
            <table className="table table-dark table-striped table-bordered table-hover table-responsive border border-warning">
                <thead>
                    <tr>
                        <th scope="col">Carrera</th>
                        <th scope="col">Gestion Inicio</th>
                        <th scope="col">Gestion Fin</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((careerAssign, index) => (
                            <tr key={index}>
                                <td>{careerAssign.name}</td>
                                <td>{careerAssign.initial_date}</td>
                                <td>{careerAssign.end_date}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="text-center">
                                No hay gestiones asignadas.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

CareerAssigns.propTypes = {
    data: PropTypes.array.isRequired,
}