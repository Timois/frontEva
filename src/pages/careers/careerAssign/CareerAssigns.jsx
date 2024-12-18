import PropTypes from "prop-types";

// Helper para capitalizar las palabras
const capitalizeTitle = (text) => {
    if (!text) return "";
    return text
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

export const CareerAssigns = ({ data }) => {
    if (data.length === 0) {
        return (
            <div className="alert alert-warning text-center">
                No hay gestiones asignadas.
            </div>
        );
    }

    // Obtener el nombre de la carrera (asumiendo que todos los registros tienen el mismo nombre)
    const careerName = capitalizeTitle(data[0].name);

    return (
        <div className="container">
            {/* Título de la carrera */}
            <h2 className="text-center mb-4">{careerName}</h2>

            {/* Listado de gestiones */}
            <div className="accordion" id="accordionExample">
                {data.map((careerAssign, index) => (
                    <div className="accordion-item" style={{ backgroundColor: "#fefefe" }} key={index}>
                        <h2 className="accordion-header" id={`heading-${index}`}>
                            <button
                                className="accordion-button"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target={`#collapse-${index}`}
                                aria-expanded="true"
                                aria-controls={`collapse-${index}`}
                                style={{
                                    backgroundColor: "#343a40", // Fondo oscuro
                                    color: "white", // Texto blanco
                                }}
                            >
                                Gestión {index + 1}
                            </button>
                        </h2>
                        <div
                            id={`collapse-${index}`}
                            className="accordion-collapse collapse"
                            aria-labelledby={`heading-${index}`}
                            data-bs-parent="#accordionExample"
                        >
                            <div className="accordion-body">
                                <p>
                                    <strong>Fecha de Inicio:</strong> {careerAssign.initial_date}
                                </p>
                                <p>
                                    <strong>Fecha de Fin:</strong> {careerAssign.end_date}
                                </p>
                                <p>
                                    <strong>Acción:</strong>
                                    {/* Aquí puedes agregar botones o acciones relacionadas */}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

CareerAssigns.propTypes = {
    data: PropTypes.array.isRequired,
};
