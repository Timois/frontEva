/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { ContainerInput } from "../login/ContainerInput";
import { Input } from "../login/Input";
import { Validate } from "./components/Validate";
import { ContainerButton } from "../login/ContainerButton";
import CancelButton from "./components/CancelButon";
import { closeFormModal, customAlert } from "../../utils/domHelper";
import { useFetchAreasActive } from "../../hooks/fetchAreas";
import { getApi, postApi } from "../../services/axiosServices/ApiService";
import { useNavigate, useParams } from "react-router-dom";
import { useFetchDisponibleQuestions } from "../../hooks/fetchQuestions";
import { ButtonImport } from "../../pages/careers/questions/imports/ButtonImport";
import { ModalImport } from "../../pages/careers/questions/imports/ModalImport";


export const FormAssignQuestions = ({ data }) => {
  const { id } = useParams();
  const [response, setResponse] = useState(false);
  const [totalAssignedScore, setTotalAssignedScore] = useState(0);
  const { areas, getDataAreas } = useFetchAreasActive();
  const { fetchDisponibles } = useFetchDisponibleQuestions();
  const isLoading = useRef(false);
  const navigate = useNavigate();
  const [percentages, setPercentages] = useState({ facil: 0, media: 0, dificil: 0 });
  const [calculatedScores, setCalculatedScores] = useState({});
  const [disponibles, setDisponibles] = useState({});
  const [modo, setModo] = useState(1); // Estado para alternar modos
  const [asignado, setAsignado] = useState(false);

  /* Cargar áreas activas de la carrera */
  useEffect(() => {
    const loadAreas = async () => {
      if (isLoading.current) return;
      const user = JSON.parse(localStorage.getItem("user"));
      const careerIdFromStorage = user ? user.career_id : null;
      if (careerIdFromStorage) {
        try {
          isLoading.current = 1;
          await getDataAreas(careerIdFromStorage);
        } finally {
          isLoading.current = false;
        }
      }
    };
    loadAreas();
  }, []);
  /* Verificar si ya hay preguntas asignadas */
  useEffect(() => {
    const verificarAsignacion = async () => {
      try {
        const res = await getApi(`question_evaluations/verifiAssignedQuestions/${id}`);
        setAsignado(res?.status || false);
      } catch (error) {
        console.error("Error verificando asignación:", error);
        setAsignado(false);
      }
    };
    if (id) verificarAsignacion();
  }, [id]);
  /* Cargar preguntas disponibles por área */
  useEffect(() => {
    const loadDisponibles = async () => {
      const disponiblesPorArea = {};
      for (const area of areas) {
        try {
          const disponibles = await fetchDisponibles(area.id, id);
          disponiblesPorArea[area.id] = disponibles || { facil: 0, media: 0, dificil: 0, total: 0 };
        } catch (error) {
          console.error(`Error al cargar preguntas del área ${area.id}:`, error);
        }
      }
      setDisponibles(disponiblesPorArea);
    };
    if (areas.length > 0) loadDisponibles();
  }, [areas]);

  const { control, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm({
    defaultValues: {
      evaluation_id: "",
      total_score: "",
      areas: [],
    },
  });
  /* Inicializar valores del formulario por área */
  useEffect(() => {
    if (areas.length > 0) {
      const defaultValues = {
        evaluation_id: data?.id || "",
        total_score: data?.total_score || "",
        areas: areas.map((area) => ({
          area_id: area.id,
          cantidadFacil: 0,
          cantidadMedia: 0,
          cantidadDificil: 0,
          puntajeTotal: 0,
          porcentajeFacil: percentages.facil,
          porcentajeMedia: percentages.media,
          porcentajeDificil: percentages.dificil,
          cantidadTotal: 0,
        })),
      };
      reset(defaultValues);
    }
  }, [areas, modo]);
  /* Calcular puntaje total asignado */
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name && (name.endsWith("puntajeTotal") || name.endsWith("cantidadTotal"))) {
        const total = value.areas?.reduce(
          (sum, area) => sum + (Number(area.puntajeTotal) || 0),
          0
        ) || 0;
        setTotalAssignedScore(total);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);
  /* Manejar cambios de porcentaje por dificultad */
  const handleAreaPercentageChange = (index, type, value) => {
    const newValue = Math.max(0, Math.min(100, Number(value)));
    setValue(`areas.${index}.porcentaje${type}`, newValue);

    const otherTypes = ["Facil", "Media", "Dificil"].filter((t) => t !== type);
    const otherValues = otherTypes.map((t) => Number(watch(`areas.${index}.porcentaje${t}`) || 0));
    const otherSum = otherValues.reduce((sum, val) => sum + val, 0);

    if (otherSum > 0) {
      const remaining = 100 - newValue;
      const factor = remaining / otherSum;
      otherTypes.forEach((t, i) =>
        setValue(`areas.${index}.porcentaje${t}`, Math.round(otherValues[i] * factor))
      );
    } else {
      const remaining = 100 - newValue;
      const share = Math.floor(remaining / otherTypes.length);
      otherTypes.forEach((t, i) =>
        setValue(
          `areas.${index}.porcentaje${t}`,
          i === otherTypes.length - 1
            ? remaining - share * (otherTypes.length - 1)
            : share
        )
      );
    }
    recalculateScores(index); // solo recalcula distribución interna del área
  };
  const recalculateScores = (index) => {
    const area = watch(`areas.${index}`);
    const totalScore = Number(area.puntajeTotal) || 0;
    const scores = calculateScoresByDifficulty(
      totalScore,
      Number(area.cantidadFacil) || 0,
      Number(area.cantidadMedia) || 0,
      Number(area.cantidadDificil) || 0,
      Number(area.porcentajeFacil),
      Number(area.porcentajeMedia),
      Number(area.porcentajeDificil)
    );

    setCalculatedScores((prev) => ({ ...prev, [index]: scores }));
  };
  const watchedAreas = watch("areas");
  useEffect(() => {
    if (watchedAreas?.length > 0 && modo === 1) {
      watchedAreas.forEach((_, index) => recalculateScores(index));
    }
  }, [watchedAreas, modo]);

  const calculateScoresByDifficulty = (
    totalScore,
    cantidadFacil,
    cantidadMedia,
    cantidadDificil,
    porcentajeFacil,
    porcentajeMedia,
    porcentajeDificil
  ) => {
    const facilPorc = porcentajeFacil / 100;
    const mediaPorc = porcentajeMedia / 100;
    const dificilPorc = porcentajeDificil / 100;
    return {
      puntajeFacil: cantidadFacil > 0 ? (totalScore * facilPorc) / cantidadFacil : 0,
      puntajeMedia: cantidadMedia > 0 ? (totalScore * mediaPorc) / cantidadMedia : 0,
      puntajeDificil: cantidadDificil > 0 ? (totalScore * dificilPorc) / cantidadDificil : 0,
      puntajeTotalFacil: (totalScore * facilPorc).toFixed(2),
      puntajeTotalMedia: (totalScore * mediaPorc).toFixed(2),
      puntajeTotalDificil: (totalScore * dificilPorc).toFixed(2),
    };
  };
  /* Enviar asignación de preguntas */
  const onSubmit = async (formData) => {
    if (totalAssignedScore !== Number(data.total_score)) {
      customAlert(
        `La suma de puntajes (${totalAssignedScore}) debe ser igual al puntaje total del examen (${data.total_score})`,
        "error"
      );
      return;
    }
    const questionsPerArea = formData.areas.map((area) => {
      const cantidadFacil = Number(area.cantidadFacil || 0);
      const cantidadMedia = Number(area.cantidadMedia || 0);
      const cantidadDificil = Number(area.cantidadDificil || 0);
      const cantidadTotal = modo
        ? cantidadFacil + cantidadMedia + cantidadDificil
        : Number(area.cantidadTotal || 0);

      if (cantidadTotal > 0) {
        return {
          id: area.area_id,
          cantidadTotal,
          nota: Number(area.puntajeTotal),
          ...(modo === 1 && { cantidadFacil, cantidadMedia, cantidadDificil }),
        };
      }
      return null;
    }).filter(Boolean);

    const payload = { evaluation_id: Number(formData.evaluation_id), ponderar: modo, areas: questionsPerArea };

    setResponse(true);
    try {
      await postApi("question_evaluations/assignQuestion", payload);
      customAlert("Asignación realizada con éxito", "success");
      navigate(-1);
    } catch (error) {
      if (error.response?.status === 409 && error.response.data?.message?.includes("ya tiene preguntas asignadas")) {
        customAlert("Esta evaluación ya tiene preguntas asignadas. No se puede volver a asignar.", "warning");
      } else {
        customAlert(error.response?.data?.message || "Error al realizar la asignación", "error");
      }
    } finally {
      setResponse(false);
    }
  };
  const resetForm = () => {
    reset({
      evaluation_id: data?.id || "",
      total_score: data?.total_score || "",
      areas: areas.map((area) => ({
        area_id: area.id,
        cantidadFacil: 0,
        cantidadMedia: 0,
        cantidadDificil: 0,
        puntajeTotal: 0,
        porcentajeFacil: percentages.facil,
        porcentajeMedia: percentages.media,
        porcentajeDificil: percentages.dificil,
        cantidadTotal: 0,
      })),
    });
  };
  const handleCancel = () => {
    closeFormModal();
    resetForm();
    navigate(-1);
  };
  /* Renderizado principal */
  return asignado ? (
    <div className="container-fluid p-4">
      <div className="card shadow-lg border-0 rounded-3 overflow-hidden">
        <div className="card-header bg-success text-white py-3 rounded-top">
          <h3 className="mb-0">La evaluación ya tiene preguntas asignadas</h3>
        </div>
        <div className="card-body p-4">
          <p>Las preguntas ya fueron asignadas a esta evaluación. No es posible volver a asignarlas desde aquí.</p>
        </div>
      </div>
    </div>
  ) : (
    <div className="container-fluid p-4">
      <div className="card shadow-lg border-0 rounded-3 overflow-hidden">
        <div className="card-header bg-primary text-white py-3 rounded-top">
          <h3 className="mb-0">{modo === 1 ? "Ponderar Preguntas" : "No Ponderar Preguntas"}</h3>
        </div>
        <div className="card-body p-4">
          <div className="d-flex gap-2 mb-4">
            <button type="button" className={`btn ${modo === 1 ? "btn-info" : "btn-outline-info"} btn-sm fw-bold`} onClick={() => setModo(1)}>📊 Ponderar</button>
            <button type="button" className={`btn ${modo === 0 ? "btn-warning" : "btn-outline-warning"} btn-sm fw-bold`} onClick={() => setModo(0)}>➖ No Ponderar</button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="alert alert-info mb-4 d-flex justify-content-between align-items-center">
              <span>ID de Evaluación: {data?.id}</span>
              <span>Puntaje Total del Examen: {data?.total_score}</span>
              <span>Puntaje Asignado: {totalAssignedScore}</span>
              {totalAssignedScore !== Number(data.total_score) && (
                <p className="text-danger text-sm mt-2">⚠️ La suma de puntajes asignados no coincide con el puntaje total.</p>
              )}
            </div>
            {isLoading.current ? (
              <div>Cargando áreas...</div>
            ) : (
              <div className="row">
                {areas?.map((area, index) => (
                  <>
                    <div key={area.id} className="col-md-6 mb-4">
                      <div className="card">
                        <div className="card-header bg-primary text-white">
                          <h5 className="mb-0">{area.name}</h5>
                        </div>
                        <div className="card-body">
                          <ContainerInput>
                            <Input
                              name={`areas.${index}.puntajeTotal`}
                              type="number"
                              placeholder="Puntaje total del área"
                              control={control}
                              onChange={() => modo === 1 && recalculateScores(index)}
                            />
                            <Validate error={errors?.areas?.[index]?.puntajeTotal} />
                          </ContainerInput>
                          {modo === 1 ? (
                            <>
                              <div className="mb-2">
                                <label>Distribución de porcentajes:</label>
                                <div className="d-flex gap-2">
                                  {["Facil", "Media", "Dificil"].map((tipo) => (
                                    <Input
                                      key={tipo}
                                      name={`areas.${index}.porcentaje${tipo}`}
                                      type="number"
                                      placeholder={`${tipo} %`}
                                      control={control}
                                      onChange={(e) => handleAreaPercentageChange(index, tipo, e.target.value)}
                                    />
                                  ))}
                                </div>
                              </div>
                              <div className="mb-2">
                                <label>Cantidades por dificultad:</label>
                                <div className="d-flex gap-2">
                                  <Input name={`areas.${index}.cantidadFacil`} type="number" placeholder="Fácil" control={control} onChange={() => recalculateScores(index)} />
                                  <Input name={`areas.${index}.cantidadMedia`} type="number" placeholder="Media" control={control} onChange={() => recalculateScores(index)} />
                                  <Input name={`areas.${index}.cantidadDificil`} type="number" placeholder="Difícil" control={control} onChange={() => recalculateScores(index)} />
                                </div>
                              </div>
                              <div className="mt-3">
                                <p><strong>Disponibilidad de preguntas:</strong></p>
                                <ul>
                                  <li>Fácil: {disponibles?.[area.id]?.facil || 0}</li>
                                  <li>Media: {disponibles?.[area.id]?.media || 0}</li>
                                  <li>Difícil: {disponibles?.[area.id]?.dificil || 0}</li>
                                </ul>
                                {disponibles?.[area.id]?.total === 0 && (
                                  <>
                                    <button
                                      type="button"
                                      className="btn btn-sm btn-success mt-2"
                                      onClick={async () => {
                                        try {
                                          await postApi(`question_evaluations/activeQuestions/${area.id}`, { evaluation_id: Number(id) });
                                          const nuevasDisponibles = await fetchDisponibles(area.id, id);
                                          setDisponibles((prev) => ({ ...prev, [area.id]: nuevasDisponibles }));
                                          customAlert("Preguntas activadas correctamente", "success");
                                        } catch (error) {
                                          customAlert(error?.response?.data?.message || "Error al activar las preguntas", "error");
                                        }
                                      }}
                                    >
                                      Activar preguntas
                                    </button>
                                    <ButtonImport
                                      modalIdImp={`importar-${area.id}`}
                                      className={`btn btn-sm btn-outline-success d-flex align-items-center ${area.status === "inactivo" ? "opacity-75" : ""
                                        }`}
                                    />
                                  </>
                                )}
                              </div>
                              {calculatedScores[index] && (
                                <div className="alert alert-secondary mt-2">
                                  <strong>Puntajes calculados:</strong>
                                  <ul className="mb-0">
                                    <li>Fácil: {calculatedScores[index].puntajeFacil} (Total: {calculatedScores[index].puntajeTotalFacil})</li>
                                    <li>Media: {calculatedScores[index].puntajeMedia} (Total: {calculatedScores[index].puntajeTotalMedia})</li>
                                    <li>Difícil: {calculatedScores[index].puntajeDificil} (Total: {calculatedScores[index].puntajeTotalDificil})</li>
                                  </ul>
                                </div>
                              )}
                            </>
                          ) : (
                            <>
                              <div className="mb-2">
                                <label>Cantidad Total de Preguntas:</label>
                                <Input
                                  name={`areas.${index}.cantidadTotal`}
                                  type="number"
                                  placeholder="Cantidad total"
                                  control={control}
                                />
                                <Validate error={errors?.areas?.[index]?.cantidadTotal} />
                              </div>
                              <div className="mb-2">
                                <label>Disponibilidad de preguntas:</label>
                                <p>{disponibles?.[area.id]?.total || 0}</p>

                                {disponibles?.[area.id]?.total === 0 && (
                                  <>
                                    <ButtonImport
                                      modalIdImp={`importar-${area.id}`}
                                      className={`btn btn-sm btn-outline-success d-flex align-items-center ${area.status === "inactivo" ? "opacity-75" : ""
                                        }`}
                                    />
                                    <button
                                      type="button"
                                      className="btn btn-sm btn-success mt-2"
                                      onClick={async () => {
                                        try {
                                          await postApi(`question_evaluations/activeQuestions/${area.id}`);
                                          const nuevasDisponibles = await fetchDisponibles(area.id, id);
                                          setDisponibles((prev) => ({ ...prev, [area.id]: nuevasDisponibles }));
                                          customAlert("Preguntas activadas correctamente", "success");
                                        } catch (error) {
                                          console.error(error);
                                          customAlert("Error al activar las preguntas", "error");
                                        }
                                      }}
                                    >
                                      Activar preguntas
                                    </button>
                                  </>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <ModalImport
                      modalIdImp={`importar-${area.id}`}
                      title={`Importar Preguntas - ${area.name}`}
                      areaId={area.id}
                    />
                  </>
                ))}
              </div>
            )}

            <ContainerButton>
              <button
                type="submit"
                name="submit"
                disabled={response || totalAssignedScore !== Number(data.total_score)}
                className="btn rounded-0 btn-lg"
                style={{ backgroundColor: "#070785", color: "white" }}
              >
                <span>{response ? "Guardando..." : "Guardar"}</span>
              </button>

              <CancelButton onClick={handleCancel} />
            </ContainerButton>
          </form>
        </div>
      </div>
    </div>
  );
};
