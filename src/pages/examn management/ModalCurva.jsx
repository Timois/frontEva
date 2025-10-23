/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { postApi } from "../../services/axiosServices/ApiService";
import { useParams } from "react-router-dom";
import { customAlert } from "../../utils/domHelper";

/* eslint-disable react/prop-types */
export const ModalCurva = ({ modalId, studentsResults, plazas }) => {
  const [minScore, setMinScore] = useState(51);
  const [evaluatedResults, setEvaluatedResults] = useState([]);
  const [summary, setSummary] = useState({ admitted: 0, notAdmitted: 0 });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { id } = useParams();
  const evaluateResults = (scoreLimit) => {
    if (!studentsResults?.length) return;

    const evaluated = studentsResults.map((student) => {
      const score = parseFloat(student.score) || 0;
      return {
        ...student,
        score,
        status: score >= scoreLimit ? "admitido" : "no_admitido",
      };
    });

    const admittedCount = evaluated.filter((s) => s.status === "admitido").length;
    const notAdmittedCount = evaluated.length - admittedCount;

    setEvaluatedResults(evaluated);
    setSummary({ admitted: admittedCount, notAdmitted: notAdmittedCount });
  };

  useEffect(() => {
    evaluateResults(minScore);
  }, [minScore, studentsResults]);

  const handleIncrement = () => setMinScore((prev) => (prev < 100 ? prev + 1 : prev));
  const handleDecrement = () => setMinScore((prev) => (prev > 0 ? prev - 1 : prev));

  const admittedResults = evaluatedResults.filter((s) => s.status === "admitido");

  const handleSaveResults = async () => {
    try {
      setLoading(true);
      setMessage("");

      const payload = {
        min_score: minScore,
        results: evaluatedResults.map((r) => ({
          student_test_id: r.student_test_id,
          qualification: r.score,
          status: r.status,
        })),
      };

      const response = await postApi(`results/save/${id}`, payload);

      customAlert("Resultados guardados correctamente ✅", "success");
      setTimeout(() => {
        const modalElement = document.getElementById(modalId);
        if (modalElement) {
          const modalInstance = window.bootstrap.Modal.getInstance(modalElement);
          if (modalInstance) {
            modalInstance.hide();
          }
        }
      }, 1000); // 1 segundo de espera opcional

    } catch (error) {
      console.error(error);
      setMessage("❌ Error al guardar los resultados");
      customAlert("Error al guardar los resultados ❌", "error");
    } finally {
      setLoading(false);
    }
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
            <div className="d-flex align-items-center gap-3 mb-3">
              <label className="form-label m-0">Nota mínima requerida:</label>
              <div className="input-group" style={{ width: "150px" }}>
                <button className="btn btn-outline-danger" type="button" onClick={handleDecrement}>
                  −
                </button>
                <input
                  type="number"
                  className="form-control text-center"
                  value={minScore}
                  onChange={(e) => setMinScore(parseFloat(e.target.value) || 0)}
                  min="0"
                  max="100"
                />
                <button className="btn btn-outline-success" type="button" onClick={handleIncrement}>
                  +
                </button>
              </div>
            </div>
            <div className="alert alert-info mb-3">
              Admitidos: <strong className="text-success">{summary.admitted}</strong> — No admitidos:{" "}
              <strong>{summary.notAdmitted}</strong> | Plazas:{" "}
              <strong className="text-primary">{plazas}</strong>
            </div>
            {admittedResults.length > 0 ? (
              <div className="table-responsive mt-3">
                <table className="table table-striped table-bordered align-middle text-center">
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
                    {admittedResults.map((s, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{s.ci}</td>
                        <td>{`${s.name} ${s.paternal_surname} ${s.maternal_surname}`}</td>
                        <td>{s.score}</td>
                        <td className="text-success fw-bold">{s.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="alert alert-secondary text-center mt-3">
                No hay estudiantes admitidos con una nota mínima de <strong>{minScore}</strong>.
              </div>
            )}
            {message && <div className="alert alert-info text-center mt-3">{message}</div>}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
              Cerrar
            </button>
            <button
              type="button"
              className="btn btn-success"
              onClick={handleSaveResults}
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar resultados"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
