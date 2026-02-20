import { useEffect } from "react"
import { fetchResultsByExam } from "../../hooks/fetchResults"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { FaFilePdf } from "react-icons/fa"
import { ButtonCurva } from "./buttons/ButtonCurva"
import { ModalCurva } from "./ModalCurva"
import { useFetchCareerById } from "../../hooks/fetchCareers"
export const ResultsByTest = () => {
  const { results, getResults } = fetchResultsByExam();
  const { career, getDataCareerById } = useFetchCareerById();
  const { id } = useParams();
  const location = useLocation();
  const places = location.state?.places;
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const careerId = user?.career_id;
    if (careerId) getDataCareerById(careerId);
  }, []);

  const capitalizeWords = (text = "") => {
    return text
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const name = capitalizeWords(career?.name || "");

  useEffect(() => {
    if (id) {
      getResults(id);
    }
  }, [id]);

  const exam = (results?.students?.[0]?.code || "").trim();

  const exportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(`Resultados del examen: ${results.evaluation_title}`, 14, 20);

    doc.setFontSize(12);
    doc.text(`Carrera: ${name}`, 14, 30);

    doc.setFontSize(10);
    doc.text(`Total estudiantes: ${results?.total_students || 0}`, 14, 38);

    const tableColumn = ["CI", "Nombre completo", "Código", "Puntaje", "Estado"];

    const tableRows =
      results?.students?.map((s) => [
        s.ci,
        `${s.name} ${s.paternal_surname} ${s.maternal_surname}`.toUpperCase(),
        s.code,
        s.score,
        s.status === "completado" ? "Completado" : "Pendiente",
      ]) || [];

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 45,
      margin: { top: 15 },
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [230, 230, 230] },
    });

    doc.save(`resultados_examen_${id}.pdf`);
  };
  const allCompleted =
    results?.students?.length > 0 &&
    results.students.every((s) => s.status === "completado")

  return (
    <div className="container mt-3">
      <div>
        <button onClick={() => navigate(-1)} className="btn btn-dark">
          Atrás
        </button>
      </div>
      <h3>Total de plazas: {places}</h3>
      <div className="d-flex flex-column mb-3 gap-2">

        <h3>Carrera: {name}</h3>
        <h3>Resultados del: {results.evaluation_title}</h3>

        {allCompleted ? (
          <button onClick={exportPDF} className="btn btn-danger w-25">
            <FaFilePdf className="me-2" />
            Descargar Resultados
          </button>
        ) : (
          <button className="btn btn-danger w-25" disabled title="Esperando que todos finalicen">
            <FaFilePdf className="me-2" />
            Descargar Resultados
          </button>
        )}

        <ButtonCurva modalId="curvaModal" />

      </div>
      <ModalCurva
        modalId="curvaModal"
        studentsResults={results?.students}
        plazas={places}
      />
      <p>Total estudiantes: {results?.total_students || 0}</p>
      <table className="table table-bordered table-hover">
        <thead className="table-dark text-center">
          <tr>
            <th>#</th>
            <th>CI</th>
            <th>Nombre completo</th>
            <th>Código</th>
            <th>Puntaje</th>
            <th>Duración</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {results?.students && results.students.length > 0 ? (
            results.students.map((s, index) => (
              <tr key={index} className="text-center">
                <td>{index + 1}</td>
                <td>{s.ci}</td>
                <td className="text-uppercase text-start">
                  {`${s.paternal_surname} ${s.maternal_surname} ${s.name}`}
                </td>
                <td>{s.code}</td>
                <td>{s.score}</td>
                <td>{s.duracion}</td>
                <td>
                  {s.status === "completado" ? (
                    <span className="badge bg-success">Completado</span>
                  ) : (
                    <span className="badge bg-warning text-dark">Pendiente</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center text-muted">
                No hay resultados disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
