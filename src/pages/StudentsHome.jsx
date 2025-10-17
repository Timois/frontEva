import { useNavigate } from "react-router-dom";

export const StudentsHome = () => {
    const navigate = useNavigate();
    const capitalizeName = (name) => {
        if (!name) return ""; // por seguridad
        return name
            .split(" ") // separar palabras por espacios
            .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // primera letra mayúscula
            .join(" "); // unir de nuevo
    };
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    const { nombre_completo } = user;
    const nombreCapitalizado = capitalizeName(nombre_completo);


    const handleViewExams = () => {
        navigate("/estudiantes/exams");
    };

    return (
        <div className="container py-5">
            <div className="card shadow-lg border-0">
                <div className="card-body text-center">
                    <h2 className="fw-bold mb-3">
                        Bienvenido, Estudiante 🎓 <span className="text-danger">{nombreCapitalizado}</span>
                    </h2>
                    <p className="text-muted fs-5 mb-4">
                        Desde esta sección puedes acceder a tus exámenes asignados y ver su estado.
                    </p>
                    <button className="btn btn-outline-primary btn-lg" onClick={handleViewExams}>
                        Ver mis exámenes
                    </button>
                </div>
            </div>
        </div>
    );
};
