/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { getApi } from "../../services/axiosServices/ApiService";

const ResultsByGroup = ({ group, show, onClose }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show && group) {
      fetchResults();
    }
  }, [show, group]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const response = await getApi(`groups/resultsGroup/${group.id}`);
      setResults(response.data.students_results || []);
    } catch (error) {
      console.error("Error cargando resultados:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`modal fade ${show ? "show d-block" : ""}`}
      tabIndex="-1"
      role="dialog"
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              Resultados del Grupo: {group?.name}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body">
            {loading ? (
              <p>Cargando resultados...</p>
            ) : results.length === 0 ? (
              <p>No hay resultados registrados para este grupo.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped table-bordered table-hover">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Estudiante</th>
                      <th>CI</th>
                      <th>Nota</th>
                      <th>Duración</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((res, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{res.student_name}</td>
                        <td>{res.student_ci}</td>
                        <td>{res.score_obtained}</td>
                        <td>{res.exam_duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsByGroup;
