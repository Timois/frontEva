import { useState } from "react";

/* eslint-disable react/prop-types */
export const ModalCurva = ({ modalId, studentsResults }) => {
    const [minScore, setMinScore] = useState("");
    const [evaluatedResults, setEvaluatedResults] = useState([]);
    const [summary, setSummary] = useState({ admitted: 0, notAdmitted: 0 });
  
    const handleApplyCurve = () => {
      if (!studentsResults?.length) return alert("No hay resultados disponibles.");
  
      const desiredMin = parseFloat(minScore);
      if (isNaN(desiredMin) || desiredMin < 0 || desiredMin > 100)
        return alert("Ingrese una nota mínima válida (0-100).");
  
      const evaluated = studentsResults.map((student) => {
        const score = parseFloat(student.score) || 0;
        return {
          ...student,
          score,
          status: score >= desiredMin ? "Admitido" : "No admitido",
        };
      });
  
      const admittedCount = evaluated.filter((s) => s.status === "Admitido").length;
      const notAdmittedCount = evaluated.length - admittedCount;
  
      setEvaluatedResults(evaluated);
      setSummary({ admitted: admittedCount, notAdmitted: notAdmittedCount });
  
      alert("Evaluación aplicada correctamente.");
    };
  
    return (
      <div className="modal fade" id={modalId} tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content">
            <div className="modal-header bg-success text-white">
              <h5 className="modal-title">Evaluación de admisión según nota mínima</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Nota mínima requerida:</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Ej. 51"
                  value={minScore}
                  onChange={(e) => setMinScore(e.target.value)}
                  min="0"
                  max="100"
                />
              </div>
              <button onClick={handleApplyCurve} className="btn btn-success mb-3">
                Evaluar admisión
              </button>
  
              {evaluatedResults.length > 0 && (
                <>
                  <div className="alert alert-info">
                    Admitidos: <strong>{summary.admitted}</strong> — No admitidos:{" "}
                    <strong>{summary.notAdmitted}</strong>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered">
                      <thead className="table-success">
                        <tr>
                          <th>#</th>
                          <th>CI</th>
                          <th>Nombre completo</th>
                          <th>Nota</th>
                          <th>Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {evaluatedResults.map((s, i) => (
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{s.ci}</td>
                            <td>{`${s.name} ${s.paternal_surname} ${s.maternal_surname}`}</td>
                            <td>{s.score}</td>
                            <td className={s.status === "Admitido" ? "text-success fw-bold" : "text-danger fw-bold"}>
                              {s.status}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  