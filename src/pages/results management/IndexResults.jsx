import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useFetchGestion } from "../../hooks/fetchGestion";
import { SelectInput } from "../../components/forms/components/SelectInput";
import { fetchResultsByExam } from "../../hooks/fetchResults";
import { useFetchPeriod } from "../../hooks/fetchPeriod";
import { useExamns } from "../../hooks/fetchExamns";

const IndexResults = () => {
  const { control, watch } = useForm();
  const { gestions, getData } = useFetchGestion();
  const { results, getResults } = fetchResultsByExam();
  const { periods, getPeriodsByCareerAndGestion } = useFetchPeriod();
  const { examns, getExamnsByCareer } = useExamns();
  const [filteredPeriods, setFilteredPeriods] = useState([]);
  const [examnOptions, setExamnOptions] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const careerId = user?.career_id ?? null;
  const selectedGestionId = watch("gestion_id");
  const selectedPeriodId = watch("period_id");
  const selectedExamnId = watch("examn_id");
  // Cargar gestiones al inicio
  useEffect(() => {
    getData();
  }, []);

  // Cargar periodos cuando cambia la gestión
  useEffect(() => {
    if (careerId && selectedGestionId) {
      getPeriodsByCareerAndGestion(careerId, selectedGestionId);
    }
  }, [careerId, selectedGestionId]);

  // Convertir gestiones
  const gestionOptions = gestions.map((g) => ({
    text: g.year,
    value: g.id,
  }));
  
  // Convertir periodos
  const periodOptions = useMemo(() => {
    return periods.map((p) => ({
      text: p.period,
      value: p.id,
      gestionId: Number(p.academic_management_id), // el que viene del backend, convertido a número si es string
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
  console.log("Examenes: ", examns);
  // Cargar exámenes cuando se selecciona un periodo
  useEffect(() => {
    if (selectedPeriodId) {
      getExamnsByCareer(selectedPeriodId);
    }
  }, [selectedPeriodId, getExamnsByCareer]);

  // Convertir exámenes en opciones
  useEffect(() => {
    const options = examns.map((e) => ({
      text: e.title,
      value: e.id,
    }));  
    setExamnOptions(options);
  }, [examns]);

  // Cargar resultados cuando se selecciona un examen
  useEffect(() => {
    if (selectedExamnId) {
      getResults(selectedExamnId); // ← este debe ser por examen, no periodo
    }
  }, [selectedExamnId]);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="container mt-4">
      <h1>Resultados de los exámenes</h1>
      <form onSubmit={handleSubmit}>
        <div
          className="d-flex gap-3 align-items-end flex-wrap border p-2 rounded"
          style={{ background: "#daf2ef" }}
        >
          <div style={{ width: "auto" }}>
            <SelectInput
              label="Seleccione una Gestión"
              name="gestion_id"
              options={gestionOptions}
              control={control}
              castToNumber= {true}
            />
          </div>

          <div style={{ width: "auto" }}>
            <SelectInput
              label="Seleccione un Periodo"
              name="period_id"
              options={filteredPeriods}
              control={control}
              castToNumber= {true}
            />
          </div>

          <div style={{ width: "auto" }}>
            <SelectInput
              label="Seleccione un Examen"
              name="examn_id"
              options={examnOptions}
              control={control}
              castToNumber= {true}
            />
          </div>
        </div>
      </form>

      {/* Resultados */}
      <div className="mt-4">
        {results && results.length > 0 ? (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>CI</th>
                <th>Nombre</th>
                <th>Nota</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.ci}>
                  <td>{r.ci}</td>
                  <td>{r.name}</td>
                  <td>{r.score}</td>
                  <td>{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-muted">Seleccione un examen para ver los resultados.</p>
        )}
      </div>
    </div>
  );
};

export default IndexResults;
