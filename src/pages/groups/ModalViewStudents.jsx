/* eslint-disable react/prop-types */
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { getApi } from "../../services/axiosServices/ApiService";

export const ModalViewStudents = ({ modalId, students, groupName, examTitle, onClose }) => {
    
    const handleGeneratePdf = async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        const careerId = user?.career_id;
        let careerData = null; // Declarar aquí
        try {
            careerData = await getApi(`careers/find/${careerId}`);
        } catch (error) {
            console.error(error?.response?.data?.message || "No se pudo obtener la carrera");
        }
        const doc = new jsPDF();
        const careerName = careerData?.name ?? "Carrera no disponible";

        doc.setFontSize(14);
        doc.text(`Carrera: ${careerName.toUpperCase()}`, 10, 10);
        doc.text(`Examen: ${examTitle}`, 10, 18);
        doc.text(`Grupo: ${groupName}`, 10, 26);

        autoTable(doc, {
            startY: 36,
            head: [['N°', 'Estudiante', 'CI']],
            body: students.map((st, index) => [
                index + 1,
                `${(st.paternal_surname || "").toUpperCase()} ${(st.maternal_surname || "").toUpperCase()} ${(st.name || "").toUpperCase()}`,
                st.ci || "-"
            ]),
            theme: "striped",
            styles: { fontSize: 10 }
        });        

        doc.save(`Estudiantes-${groupName}.pdf`);
    };

    return (
        <div
            className="modal fade show d-block"
            id={modalId}
            tabIndex="-1"
            aria-modal="true"
            style={{ zIndex: "1100", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">

                    <div className="modal-header">
                        <h5 className="modal-title">Lista de Estudiantes</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>

                    <div className="modal-body">
                        {students.length > 0 ? (
                            <ul className="list-group">
                                {[...students]
                                    .sort((a, b) => {
                                        const nameA = (a.paternal_surname || a.maternal_surname || "").toLowerCase();
                                        const nameB = (b.paternal_surname || b.maternal_surname || "").toLowerCase();
                                        return nameA.localeCompare(nameB);
                                    })
                                    .map((student, index) => (
                                        <li key={index} className="list-group-item text-capitalize">
                                            {index + 1}. {student.paternal_surname || ""} {student.maternal_surname || ""} {student.name}
                                        </li>
                                    ))}
                            </ul>
                        ) : (
                            <p className="text-muted">Este grupo no tiene estudiantes.</p>
                        )}
                    </div>

                    <div className="modal-footer">

                        <button className="btn btn-primary" onClick={handleGeneratePdf}>
                            Generar PDF
                        </button>

                        <button className="btn btn-secondary" onClick={onClose}>
                            Cerrar
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};
