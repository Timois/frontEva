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
  const { fetchDisponibles } = useFetchDisponibleQuestions()
  const isLoading = useRef(false);
  const navigate = useNavigate();
  const [percentages, setPercentages] = useState({
    facil: 0,
    media: 0,
    dificil: 0,
  });
  const [calculatedScores, setCalculatedScores] = useState({});
  const [disponibles, setDisponibles] = useState([]);
  const [modo, setModo] = useState(1); // Estado para alternar modos
  const [asignado, setAsignado] = useState(false);

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

  useEffect(() => {
    const verificarAsignacion = async () => {
      try {
        const res = await getApi(`question_evaluations/verifiAssignedQuestions/${id}`);
        if (res && res.status) {
          setAsignado(true);
        } else {
          setAsignado(false);
        }
      } catch (error) {
        console.error("Error verificando asignación:", error);
        setAsignado(false); // En caso de error, mejor dejarlo en false
      }
    };

    if (id) {
      verificarAsignacion();
    }
  }, [id]);



  useEffect(() => {
    const loadDisponibles = async () => {
      const disponiblesPorArea = {};
      for (const area of areas) {
        try {
          const disponibles = await fetchDisponibles(area.id);
          if (disponibles) {
            disponiblesPorArea[area.id] = disponibles;
          }
        } catch (error) {
          console.error(`Error al cargar preguntas del área ${area.id}:`, error);
        }
      }
      setDisponibles(disponiblesPorArea);
    };

    if (areas.length > 0) {
      loadDisponibles();
    }
  }, [areas]);

  const { control, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm({
    defaultValues: {
      evaluation_id: "",
      total_score: "",
      areas: [],
    },
  });

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
          cantidadTotal: 0, // Para el modo "No Ponderar"
        })),
      };
      reset(defaultValues);
    }
  }, [areas, modo]);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name && (name.endsWith("puntajeTotal") || name.endsWith("cantidadTotal"))) {
        const scores = value.areas?.map((area) => Number(area.puntajeTotal) || 0) || [];
        const total = scores.reduce((sum, score) => sum + score, 0);
        setTotalAssignedScore(total);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  const handleAreaPercentageChange = (index, type, value) => {
    const newValue = Math.max(0, Math.min(100, Number(value)));
    setValue(`areas.${index}.porcentaje${type}`, newValue);

    const otherTypes = ["Facil", "Media", "Dificil"].filter((t) => t !== type);
    const otherValues = otherTypes.map((t) => Number(watch(`areas.${index}.porcentaje${t}`) || 0));
    const otherSum = otherValues.reduce((sum, val) => sum + val, 0);

    if (otherSum > 0) {
      const remaining = 100 - newValue;
      const factor = remaining / otherSum;
      otherTypes.forEach((t, i) => {
        const adjustedValue = Math.round(otherValues[i] * factor);
        setValue(`areas.${index}.porcentaje${t}`, adjustedValue);
      });
    } else {
      const remaining = 100 - newValue;
      const share = Math.floor(remaining / otherTypes.length);
      otherTypes.forEach((t, i) => {
        setValue(`areas.${index}.porcentaje${t}`, i === otherTypes.length - 1 ? remaining - share * (otherTypes.length - 1) : share);
      });
    }

    recalculateScores(index);
  };

  const recalculateScores = (index) => {
    const area = watch(`areas.${index}`);
    const totalScore = Number(area.puntajeTotal) || 0;
    const cantidadFacil = Number(area.cantidadFacil) || 0;
    const cantidadMedia = Number(area.cantidadMedia) || 0;
    const cantidadDificil = Number(area.cantidadDificil) || 0;

    const scores = calculateScoresByDifficulty(
      totalScore,
      cantidadFacil,
      cantidadMedia,
      cantidadDificil,
      Number(area.porcentajeFacil),
      Number(area.porcentajeMedia),
      Number(area.porcentajeDificil)
    );

    setCalculatedScores((prev) => ({
      ...prev,
      [index]: scores,
    }));
  };

  const watchedAreas = watch("areas");

  useEffect(() => {
    if (watchedAreas?.length > 0 && modo === 1) {
      watchedAreas.forEach((_, index) => {
        recalculateScores(index);
      });
    }
  }, [watchedAreas, modo]);

  const onSubmit = async (formData) => {
    if (totalAssignedScore !== Number(data.total_score)) {
      customAlert(
        `La suma de puntajes (${totalAssignedScore}) debe ser igual al puntaje total del examen (${data.total_score})`,
        "error"
      );
      return;
    }

    const questionsPerArea = [];

    formData.areas.forEach((area) => {
      const cantidadTotal = modo
        ? Number(area.cantidadFacil || 0) +
        Number(area.cantidadMedia || 0) +
        Number(area.cantidadDificil || 0)
        : Number(area.cantidadTotal || 0);

      if (cantidadTotal > 0) {
        questionsPerArea.push({
          id: area.area_id,
          cantidadTotal,
          nota: Number(area.puntajeTotal),
        });
      }
    });

    const payload = {
      evaluation_id: Number(formData.evaluation_id),
      ponderar: modo,
      areas: questionsPerArea,
    };

    setResponse(1);
    try {
      await postApi("question_evaluations/assignQuestion", payload);
      customAlert("Asignación realizada con éxito", "success");
      navigate(-1);
    } catch (error) {
      if (
        error.response &&
        error.response.status === 409 &&
        error.response.data?.message?.includes("ya tiene preguntas asignadas")
      ) {
        customAlert("Esta evaluación ya tiene preguntas asignadas. No se puede volver a asignar.", "warning");
      } else {
        customAlert("Error al realizar la asignación", "error");
      }
    } finally {
      setResponse(false);
    }

  };

  const calculateScoresByDifficulty = (
    totalScore,
    cantidadFacil,
    cantidadMedia,
    cantidadDificil,
    porcentajeFacil,
    porcentajeMedia,
    porcentajeDificil
  ) => {
    const facilPorcentaje = porcentajeFacil / 100;
    const mediaPorcentaje = porcentajeMedia / 100;
    const dificilPorcentaje = porcentajeDificil / 100;

    const puntajeFacil = cantidadFacil > 0 ? (totalScore * facilPorcentaje) / cantidadFacil : 0;
    const puntajeMedia = cantidadMedia > 0 ? (totalScore * mediaPorcentaje) / cantidadMedia : 0;
    const puntajeDificil = cantidadDificil > 0 ? (totalScore * dificilPorcentaje) / cantidadDificil : 0;

    return {
      puntajeFacil: puntajeFacil.toFixed(2),
      puntajeMedia: puntajeMedia.toFixed(2),
      puntajeDificil: puntajeDificil.toFixed(2),
      puntajeTotalFacil: (totalScore * facilPorcentaje).toFixed(2),
      puntajeTotalMedia: (totalScore * mediaPorcentaje).toFixed(2),
      puntajeTotalDificil: (totalScore * dificilPorcentaje).toFixed(2),
    };
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
  const modalId = "importExcel"
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
          <h3 className="mb-0">
            {modo === 1 ? "Ponderar Preguntas" : "No Ponderar Preguntas"}
          </h3>
        </div>
        <div className="card-body p-4">
          <div className="d-flex gap-2 mb-4">
            <button
              type="button"
              className={`btn ${modo === 1 ? "btn-primary" : "btn-outline-primary"} btn-sm`}
              onClick={() => setModo(1)}
            >
              Ponderar
            </button>
            <button
              type="button"
              className={`btn ${modo === 0 ? "btn-primary" : "btn-outline-primary"} btn-sm`}
              onClick={() => setModo(0)}
            >
              No Ponderar
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="alert alert-info mb-4">
              <div className="d-flex justify-content-between align-items-center">
                <span>ID de Evaluación: {data?.id}</span>
                <span>Puntaje Total del Examen: {data?.total_score}</span>
                <span>Puntaje Asignado: {totalAssignedScore}</span>
                {totalAssignedScore !== Number(data.total_score) && (
                  <p className="text-danger text-sm mt-2">
                    ⚠️ La suma de puntajes asignados no coincide con el puntaje total.
                  </p>
                )}
              </div>
            </div>

            {isLoading.current ? (
              <div>Cargando áreas...</div>
            ) : (
              <div className="row">
                {areas?.map((area, index) => (
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
                                <Input
                                  name={`areas.${index}.cantidadFacil`}
                                  type="number"
                                  placeholder="Fácil"
                                  control={control}
                                  onChange={() => recalculateScores(index)}
                                />
                                <Input
                                  name={`areas.${index}.cantidadMedia`}
                                  type="number"
                                  placeholder="Media"
                                  control={control}
                                  onChange={() => recalculateScores(index)}
                                />
                                <Input
                                  name={`areas.${index}.cantidadDificil`}
                                  type="number"
                                  placeholder="Difícil"
                                  control={control}
                                  onChange={() => recalculateScores(index)}
                                />
                              </div>
                            </div>
                            <div className="mt-3">
                              <p><strong>Disponibilidad de preguntas:</strong></p>
                              <ul>
                                <li>Fácil: {disponibles?.[area.id]?.facil || 0}</li>
                                <li>Media: {disponibles?.[area.id]?.media || 0}</li>
                                <li>Difícil: {disponibles?.[area.id]?.dificil || 0}</li>
                              </ul>
                              {(disponibles?.[area.id]?.facil === 0 &&
                                disponibles?.[area.id]?.media === 0 &&
                                disponibles?.[area.id]?.dificil === 0) && (
                                  <div className="alert alert-warning mt-2">
                                    No hay preguntas disponibles en esta área.{" "}
                                    <ButtonImport modalIdImp={modalId} />
                                  </div>
                                )}
                            </div>
                            {calculatedScores[index] && (
                              <div className="alert alert-secondary mt-2">
                                <strong>Puntajes calculados:</strong>
                                <ul className="mb-0">
                                  <li>
                                    Fácil: {calculatedScores[index].puntajeFacil} (Total: {calculatedScores[index].puntajeTotalFacil})
                                  </li>
                                  <li>
                                    Media: {calculatedScores[index].puntajeMedia} (Total: {calculatedScores[index].puntajeTotalMedia})
                                  </li>
                                  <li>
                                    Difícil: {calculatedScores[index].puntajeDificil} (Total: {calculatedScores[index].puntajeTotalDificil})
                                  </li>
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
                              <p>{disponibles?.[area.id]?.total}</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <ContainerButton>
              <button
                type="submit"
                name="submit"
                disabled={
                  response || totalAssignedScore !== Number(data.total_score)
                }
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
      <ModalImport modalIdImp={modalId} />
    </div>
  );
};