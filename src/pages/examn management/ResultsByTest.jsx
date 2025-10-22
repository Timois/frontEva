import { useEffect } from "react"
import { fetchResultsByExam } from "../../hooks/fetchResults"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import jsPDF from "jspdf"
import "jspdf-autotable"
import { FaFilePdf } from "react-icons/fa"
import { ButtonCurva } from "./buttons/ButtonCurva"
import { ModalCurva } from "./ModalCurva"

export const ResultsByTest = () => {
  const { results, getResults } = fetchResultsByExam()
  const { id } = useParams()
  const location = useLocation()
  const places = location.state?.places
  const navigate = useNavigate()
  useEffect(() => {
    if (id) {
      getResults(id)
    }
  }, [id])

  const exportPDF = () => {
    const doc = new jsPDF()

    doc.setFontSize(16)
    doc.text("Resultados del Examen", 14, 20)
    doc.setFontSize(10)
    doc.text(`Total estudiantes: ${results?.total_students || 0}`, 14, 28)

    const tableColumn = ["CI", "Nombre completo", "Código", "Puntaje", "Estado"]
    const tableRows = results?.students?.map((s) => [
      s.ci,
      `${s.name} ${s.paternal_surname} ${s.maternal_surname}`,
      s.code,
      s.score,
      s.status === "completado" ? "Completado" : "Pendiente"
    ]) || []

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 35
    })

    doc.save(`resultados_examen_${id}.pdf`)
  }

  // 🔑 Validar si todos están completados
  const allCompleted = results?.students?.length > 0
    && results.students.every(s => s.status === "completado")

  return (
    <div className="container mt-3">
       <h3>Total de plazas: {places}</h3>
      <div>
        <button onClick={() => navigate(-1)} className="btn btn-primary">
          Atras
        </button>
      </div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Resultados del Examen</h3>

        {allCompleted ? (
          <button onClick={exportPDF} className="btn btn-danger">
            <FaFilePdf className="me-2" />
            Descargar Resultados
          </button>

        ) : (
          <button className="btn btn-danger" disabled title="Esperando que todos finalicen">
            <FaFilePdf className="me-2" />
            Descargar Resultados
          </button>
        )}
        <ButtonCurva modalId="curvaModal" />
      </div>
      <ModalCurva modalId="curvaModal" studentsResults={results?.students} />
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
                <td className="text-capitalize">
                  {`${s.name} ${s.paternal_surname} ${s.maternal_surname}`}
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
              <td colSpan="5" className="text-center text-muted">
                No hay resultados disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
