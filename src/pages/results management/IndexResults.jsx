/* eslint-disable no-unused-vars */
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { SelectInput } from "../../components/forms/components/SelectInput";
import { fetchResultsByExam } from "../../hooks/fetchResults";
import { useExamns } from "../../hooks/fetchExamns";
import { Button } from "../../components/login/Button";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaFilePdf } from "react-icons/fa";
import { useFetchCareerAssign, useFetchCareerAssignPeriod } from "../../hooks/fetchCareers";
const IndexResults = () => {
  const { control, watch } = useForm();
  const { careerAssignments, getDataCareerAssignments } = useFetchCareerAssign();
  const { results, getFinalResults } = fetchResultsByExam();
  const { careerAssignmentsPeriods, getDataCareerAssignmentPeriods } = useFetchCareerAssignPeriod();
  const { examns, getExmansByPeriod } = useExamns();

  const [filteredPeriods, setFilteredPeriods] = useState([]);
  const [examnOptions, setExamnOptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const user = JSON.parse(localStorage.getItem("user"));
  const careerId = user?.career_id ?? null;
  const selectedGestionId = watch("academic_management_career_id");
  const selectedPeriodId = watch("academic_management_period_id");
  const selectedExamnId = watch("examn_id");

  useEffect(() => {
    if (careerId) {
      getDataCareerAssignments(careerId);
    }
  }, [careerId]);

  const academic_management_career_id = careerAssignments[0]?.academic_management_career_id;

  useEffect(() => {
    if (academic_management_career_id) {
      getDataCareerAssignmentPeriods(academic_management_career_id);
    }
  }, [academic_management_career_id]);

  const gestionOptions = careerAssignments.map((g) => ({
    text: g.year,
    value: g.academic_management_career_id
  }));

  const periodOptions = useMemo(() => {
    return careerAssignmentsPeriods.map((p) => ({
      text: p.period,
      value: p.academic_management_period_id,
    }));
  }, [careerAssignmentsPeriods]);

  useEffect(() => {
    setFilteredPeriods(periodOptions);
  }, [periodOptions]);

  useEffect(() => {
    setFilteredPeriods(periodOptions);
  }, [periodOptions]);

  useEffect(() => {
    if (selectedPeriodId) {
      getExmansByPeriod(selectedPeriodId);
    }
  }, [selectedPeriodId]);

  useEffect(() => {
    const options = examns.map((e) => ({
      text: e.title,
      value: e.id,
    }));
    setExamnOptions(options);
  }, [examns]);

  useEffect(() => {
    setExamnOptions([]);
  }, [selectedPeriodId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Number.isInteger(selectedExamnId)) {
      getFinalResults(selectedExamnId);
      setCurrentPage(1);
    }
  }
  const totalItems = results?.students_results?.length ?? 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentItems = results?.students_results?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  ) ?? [];

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };
  const capitalizeWords = (str) =>
    str
      ?.toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const downloadPdf = () => {
    if (!results?.students_results?.length) return;

    const gestion = careerAssignments.find(g => g.academmic_management_career_id === selectedGestionId);
    const period = careerAssignmentsPeriods.find(p => p.id === selectedPeriodId);
    const examn = examns.find(e => e.id === selectedExamnId);

    const gestionText = gestion?.year || "desconocido";
    const periodText = period?.period || "desconocido";
    const examnTitle = examn?.title || "Examen";

    const doc = new jsPDF();

    const titulo = `Resultados del Examen - ${examnTitle}`;
    const subtitulo = `Gestión: ${gestionText} - Periodo: ${periodText}`;
    
    doc.setFontSize(14);
    doc.text(titulo, 14, 15);
    doc.setFontSize(11);
    doc.text(subtitulo, 14, 22);

    const tableColumn = ["N°", "CI", "Nombre", "Apellido Paterno", "Apellido Materno", "Nota"];
    const tableRows = results.students_results.map((student, index) => [
      index + 1,
      student.ci,
      capitalizeWords(student.name),
      capitalizeWords(student.paternal_surname),
      capitalizeWords(student.maternal_surname),
      student.score
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        halign: 'center',
      },
      bodyStyles: {
        halign: 'center',
      },
    });

    const fileName = `resultados_examen_${gestionText}_${periodText}_${examnTitle}.pdf`;
    doc.save(fileName);
  };

  return (
    <div className="container mt-4">
      <h1>Resultados de los exámenes</h1>
      <form onSubmit={handleSubmit}>
        <div className="d-flex gap-5 align-items-center flex-wrap border p-2 rounded" style={{ background: "#daf2ef" }}>
          <div>
            <SelectInput label="Seleccione una Gestión" name="academic_management_career_id" options={gestionOptions} control={control} castToNumber={true} />
          </div>
          <div>
            <SelectInput label="Seleccione un Periodo" name="academic_management_period_id" options={periodOptions} control={control} castToNumber={true} />
          </div>
          <div>
            <SelectInput label="Seleccione un Examen" name="examn_id" options={examnOptions} control={control} castToNumber={true} />
          </div>
          <div>
            <Button type="submit" name="submit" disabled={!Number.isInteger(selectedExamnId)}>
              Buscar
            </Button>
          </div>
        </div>
      </form>
      <div className="d-flex w-100 p-2 m-2 justify-content-end" >
        <button className="rounded" onClick={downloadPdf}>
          <FaFilePdf size={24} className="text-danger" /> Descargar
        </button>
      </div>
      <div className="mt-4">
        <table className="table table-hover align-middle mb-0">
          <thead className="bg-light">
            <tr className="text-center">
              <th scope="col" width="5%" className="fw-medium text-primary">N°</th>
              <th scope="col" width="15%" className="fw-medium text-primary">CI</th>
              <th scope="col" width="15%" className="fw-medium text-primary">Nota</th>
              <th scope="col" width="10%" className="fw-medium text-primary">Estado</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((r, index) => (
                <tr key={r.student_id} className="transition-all text-center">
                  <td className="fw-bold text-muted">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="text-muted">{r.student_ci || "—"}</td>
                  <td>
                    <span className="badge bg-success bg-opacity-10 text-success py-2 px-3">
                      {r.score_obtained ?? 0}
                    </span>
                  </td>
                  <td>
                    {r.status === "admitido" ? (
                      <span className="badge bg-success bg-opacity-10 text-success py-2 px-3">
                        <i className="bi bi-check-circle-fill me-1"></i> Admitido
                      </span>
                    ) : (
                      <span className="badge bg-warning bg-opacity-10 text-danger py-2 px-3">
                        <i className="bi bi-hourglass-split me-1"></i> No admitido
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-5">
                  <div className="d-flex flex-column align-items-center text-muted">
                    <i className="bi bi-clipboard-x fs-1 mb-2" />
                    No hay resultados registrados para este examen.
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {totalPages > 1 && (
          <nav className="d-flex justify-content-center mt-4">
            <ul className="pagination">
              <li className={`page-item ${currentPage === 1 && "disabled"}`}>
                <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Anterior</button>
              </li>
              {[...Array(totalPages)].map((_, i) => (
                <li key={i} className={`page-item ${currentPage === i + 1 && "active"}`}>
                  <button className="page-link" onClick={() => handlePageChange(i + 1)}>{i + 1}</button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages && "disabled"}`}>
                <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Siguiente</button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
};

export default IndexResults;
