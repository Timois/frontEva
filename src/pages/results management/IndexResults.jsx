import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useFetchGestion } from "../../hooks/fetchGestion";
import { SelectInput } from "../../components/forms/components/SelectInput";
import { fetchResultsByExam } from "../../hooks/fetchResults";
import { useFetchPeriod } from "../../hooks/fetchPeriod";
import { useExamns } from "../../hooks/fetchExamns";
import { Button } from "../../components/login/Button";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
const IndexResults = () => {
  const { control, watch } = useForm();
  const { gestions, getData } = useFetchGestion();
  const { results, getResults } = fetchResultsByExam();
  const { periods, getPeriodsByCareerAndGestion } = useFetchPeriod();
  const { examns, getExmansByPeriod } = useExamns();

  const [filteredPeriods, setFilteredPeriods] = useState([]);
  const [examnOptions, setExamnOptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const user = JSON.parse(localStorage.getItem("user"));
  const careerId = user?.career_id ?? null;
  const selectedGestionId = watch("gestion_id");
  const selectedPeriodId = watch("period_id");
  const selectedExamnId = watch("examn_id");

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (careerId && selectedGestionId) {
      getPeriodsByCareerAndGestion(careerId, selectedGestionId);
    }
  }, [careerId, selectedGestionId]);

  const gestionOptions = gestions.map((g) => ({
    text: g.year,
    value: g.id,
  }));

  const periodOptions = useMemo(() => {
    return periods.map((p) => ({
      text: p.period,
      value: p.id,
      gestionId: Number(p.academic_management_id),
    }));
  }, [periods]);

  useEffect(() => {
    if (selectedGestionId) {
      const filtered = periodOptions.filter(
        (p) => p.gestionId === Number(selectedGestionId)
      );
      setFilteredPeriods(filtered);
    } else {
      setFilteredPeriods([]);
    }
  }, [selectedGestionId, periodOptions]);

  useEffect(() => {
    if (selectedPeriodId && examns.length === 0) {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Number.isInteger(selectedExamnId)) {
      getResults(selectedExamnId);
      setCurrentPage(1); // Reinicia a la primera página al buscar
    }
  };

  const totalItems = results?.students?.length ?? 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentItems = results?.students?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  ) ?? [];

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };
  const downloadPdf = () => {
    if (!results?.students?.length) return;

    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text("Resultados del Examen", 14, 15);

    const tableColumn = ["N°", "CI", "Nombre", "Apellido Paterno", "Apellido Materno", "Nota"];
    const tableRows = results.students.map((student, index) => [
      index + 1,
      student.ci,
      student.name,
      student.paternal_surname,
      student.maternal_surname,
      student.score
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
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

    doc.save("resultados_examen.pdf");
  };
  return (
    <div className="container mt-4">
      <h1>Resultados de los exámenes</h1>
      <form onSubmit={handleSubmit}>
        <div className="d-flex gap-3 align-items-end flex-wrap border p-2 rounded" style={{ background: "#daf2ef" }}>
          <div>
            <SelectInput label="Seleccione una Gestión" name="gestion_id" options={gestionOptions} control={control} castToNumber={true} />
          </div>
          <div>
            <SelectInput label="Seleccione un Periodo" name="period_id" options={filteredPeriods} control={control} castToNumber={true} />
          </div>
          <div>
            <SelectInput label="Seleccione un Examen" name="examn_id" options={examnOptions} control={control} castToNumber={true} />
          </div>
          <div>
            <Button type="submit" name="submit" disabled={!Number.isInteger(selectedExamnId)}>
              <span>Buscar</span>
            </Button>
          </div>
        </div>
      </form>
      <div className="p-2 bg-primary text-white rounded pointer" onClick={downloadPdf} style={{ cursor: "pointer", width: "fit-content" }}>
        Descargar PDF
      </div>
      <div className="mt-4">
        <table className="table table-hover align-middle mb-0">
          <thead className="bg-light">
            <tr className="text-center">
              <th scope="col" width="5%" className="fw-medium text-primary">N°</th>
              <th scope="col" width="15%" className="fw-medium text-primary">CI</th>
              <th scope="col" width="25%" className="fw-medium text-primary">Nombre</th>
              <th scope="col" width="20%" className="fw-medium text-primary">Apellido Paterno</th>
              <th scope="col" width="20%" className="fw-medium text-primary">Apellido Materno</th>
              <th scope="col" width="10%" className="fw-medium text-primary">Nota</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((r, index) => (
                <tr key={r.ci} className="transition-all text-center">
                  <td className="fw-bold text-muted">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="text-muted">{r.ci}</td>
                  <td className="fw-semibold text-start text-capitalize">{r.name}</td>
                  <td className="fw-semibold text-start text-capitalize">{r.paternal_surname}</td>
                  <td className="fw-semibold text-start text-capitalize">{r.maternal_surname}</td>
                  <td>
                    <span className="badge bg-success bg-opacity-10 text-success py-2 px-3">
                      {r.score}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-5">
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
