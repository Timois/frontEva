/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GroupSchema } from "../../models/schemas/GroupSchema";
import { postApi } from "../../services/axiosServices/ApiService";
import { closeFormModal, customAlert } from "../../utils/domHelper";
import { ContainerInput } from "../login/ContainerInput";
import { Validate } from "./components/Validate";
import { fetchLabs } from "../../hooks/fetchLabs";
import { useNavigate, useParams } from "react-router-dom";
import { useExamns } from "../../hooks/fetchExamns";
import { fetchGroupByEvaluation } from "../../hooks/fetchGroup";
import { Card } from "../login/Card";
import { BigCalendar } from "./components/BigCalendar"; // Tu componente
import { ContainerButton } from "../login/ContainerButton";
import { Button } from "../login/Button";
import CancelButton from "./components/CancelButon";
import { Input } from "../login/Input";
import { DateInput } from "./components/DateInput";
import moment from "moment";

// Helper para calcular hora fin
const calculateEndTime = (startTime, durationMinutes) => {
    if (!startTime || !durationMinutes) return "";
    const [hours, minutes] = startTime.split(":").map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes + durationMinutes);
    const h = date.getHours().toString().padStart(2, "0");
    const m = date.getMinutes().toString().padStart(2, "0");
    return `${h}:${m}`;
};

export const FormGroup = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Hooks
    const { examn, getExamnById } = useExamns();
    const { refreshGroups } = fetchGroupByEvaluation();
    const { labs, getDataLabs, getHorarioByLab } = fetchLabs();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [calendarEvents, setCalendarEvents] = useState([]); // Eventos para el calendario

    const { control, handleSubmit, reset, watch, setValue, setError, formState: { errors }, } = useForm({
        resolver: zodResolver(GroupSchema(false)),
        defaultValues: {
            name: "",
            description: "",
            laboratory_ids: [],
            date: moment().format("YYYY-MM-DD"), // Add date field with today as default
            start_time: "",
            end_time: "",
        },
    });

    // Observar valores
    const watchedStartTime = watch("start_time");
    const watchedLabIds = watch("laboratory_ids");

    useEffect(() => {
        const loadData = async () => {
            await getDataLabs();
            if (id) await getExamnById(id);
        };
        loadData();
    }, [id]);

    // Auto-calcular Hora Fin
    useEffect(() => {
        if (watchedStartTime && examn?.duration) {
            const endTime = calculateEndTime(watchedStartTime, Number(examn.duration));
            setValue("end_time", endTime);
        }
    }, [watchedStartTime, examn, setValue]);

    // Lógica para actualizar el Calendario cuando seleccionan laboratorios
    const getSchedules = async () => {
        if (!labs || labs.length === 0) return;
        if (watchedLabIds && watchedLabIds.length > 0) {
            const numericLabIds = watchedLabIds.map(id => Number(id));
            const selectedLabs = labs.filter(l => numericLabIds.includes(Number(l.id)));
            const response = await getHorarioByLab({
                ids: selectedLabs.map((lab) => Number(lab.id)),
            });
            setCalendarEvents(response ?? []);
        } else {
            setCalendarEvents([]);
        }
    };
    useEffect(() => {
        if (labs.length > 0) {
            getSchedules();
        }
    }, [watchedLabIds, labs]);

    const labOptions = useMemo(() => {
        return labs.map((lab) => ({
            value: lab.id,
            label: `${lab.name} - ${lab.career?.name || ""}`,
        }));
    }, [labs]);

    const onSubmit = async (data) => {
        console.log("DATA EN SUBMIT ===>", data);
        if (data.laboratory_ids.length === 0) {
            customAlert("Debe seleccionar al menos un laboratorio.", "warning");
            return;
        }

        // Get date from watched value or use today
        const baseDate = watch("date") || moment().format("YYYY-MM-DD");

        // Combine date with time to create full datetime strings
        const startDateTime = `${baseDate} ${data.start_time}:00`;
        const endDateTime = `${baseDate} ${data.end_time}:00`;

        setIsSubmitting(true);

        // Create groups for each selected laboratory
        const errors = [];
        const successes = [];

        for (const labId of data.laboratory_ids) {
            // Create FormData object
            const formData = new FormData();
            formData.append('evaluation_id', parseInt(id));
            formData.append('laboratory_id', labId); // Send ONE laboratory ID (singular)
            formData.append('name', data.name.trim());
            formData.append('description', data.description?.trim() || "");
            formData.append('start_time', startDateTime);
            formData.append('end_time', endDateTime);

            try {
                const response = await postApi("groups/save", formData);
                successes.push(`Grupo creado en laboratorio ${labId}`);
                getSchedules();
            } catch (error) {
                const msg = error.response?.data?.message || `Error en laboratorio ${labId}`;
                errors.push(msg);
            }
        }

        setIsSubmitting(false);

        if (successes.length > 0) {
            customAlert(`${successes.length} grupo(s) creado(s) correctamente!`, "success");
            // await refreshGroups(id);
            // Keep selected laboratories and reset only other fields
            const selectedLabs = data.laboratory_ids;
            reset();
            setValue("laboratory_ids", selectedLabs);
        }

        if (errors.length > 0) {
            customAlert(errors.join("\n"), "error");
        }
    };

    const handleCancel = () => {
        reset();
        navigate(-1);
    };

    const handleCalendarDoubleClick = (event) => {
        if (event.start) {
            const timeString = moment(event.start).format("HH:mm");
            const laboratorio = event.nombre_laboratorio || "Laboratorio desconocido";
            const grupo = event.nombre_grupo || "Sin grupo asignado";
            setValue("start_time", timeString);
            customAlert(
                `El ${laboratorio} ya está ocupado por el ${grupo} a las ${timeString}.`,
                "info"
            );
        }
    };
    const handleSelectSlot = ({ start, end }) => {
        const date = moment(start).format("YYYY-MM-DD");
        const startTime = moment(start).format("HH:mm");
        const endTime = moment(end).format("HH:mm");
        const ellapsedMinutes = moment(end).diff(moment(start), "minutes");

        setValue("date", date);
        setValue("start_time", startTime);
        setValue("end_time", endTime);

        const checkIfDaveIsValid = checkIfDateIsMoreThanOneDay(ellapsedMinutes) && checkIfDateIsMoreThanToday(date);

        if (!checkIfDaveIsValid) {
            customAlert("La fecha seleccionada no es válida.", "warning");
            return;
        }
    };

    const checkIfDateIsMoreThanToday = (selectedDate) => {
        const today = moment().startOf("day");
        const selected = moment(selectedDate, "YYYY-MM-DD").startOf("day");
        return !selected.isBefore(today);
    }

    const checkIfDateIsMoreThanOneDay = (ellapsedMinutes) => {
        const maxTime = 5 * 60; // 5 horas en minutos
        return ellapsedMinutes < maxTime;
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="card p-3 mb-3">
                <h5>Ver horarios programados por laboratorios</h5>
                <Controller
                    name="laboratory_ids"
                    control={control}
                    render={({ field }) => (
                        <div
                            className="lab-grid"
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                                gap: "12px",
                            }}
                        >
                            {labOptions.map((lab) => {
                                const isChecked = field.value.includes(lab.value);
                                return (
                                    <label
                                        key={lab.value}
                                        className="lab-card"
                                        style={{
                                            border: isChecked ? "2px solid #0d6efd" : "1px solid #ccc",
                                            borderRadius: "8px",
                                            padding: "10px",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                            cursor: "pointer",
                                            backgroundColor: isChecked ? "#e7f1ff" : "white",
                                            transition: "0.2s",
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            value={lab.value}
                                            checked={isChecked}
                                            onChange={(e) => {
                                                const selectedValue = parseInt(e.target.value);
                                                let updatedValues = [...field.value];
                                                if (e.target.checked) {
                                                    updatedValues.push(selectedValue);
                                                } else {
                                                    updatedValues = updatedValues.filter(
                                                        (id) => id !== selectedValue
                                                    );
                                                }
                                                field.onChange(updatedValues);
                                            }}
                                        />
                                        <span style={{ fontSize: "14px", fontWeight: 500 }}>
                                            {lab.label}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    )}
                />
                <Validate errors={errors.laboratory_ids} />
            </div>
            <ContainerInput>
                <Input
                    name="name"
                    placeholder="Ej: Grupo A"
                    control={control}
                    errors={errors}
                    label="Nombre del Grupo"
                />
                <Validate errors={errors.name} />
            </ContainerInput>
            <ContainerInput>
                <Input
                    name="description"
                    placeholder="Ej: Grupo de estudiantes de la carrera de Ingeniería de Sistemas"
                    control={control}
                    errors={errors}
                    label="Descripción"
                />
                <Validate errors={errors.description} />
            </ContainerInput>
            <ContainerInput>
                <div style={{ display: "flex", gap: "10px", justifyContent: "space-around" }}>
                    <DateInput label="Hora Inicio" name="start_time" control={control} type="time" />
                    <DateInput label="Hora Fin" name="end_time" control={control} type="time" />
                </div>
            </ContainerInput>
            <ContainerInput>
                <Card className="card align-items-center h-auto gap-3 p-3 w-100">
                    <h6 className="w-100 text-start">Disponibilidad de Laboratorios Seleccionados</h6>
                    <BigCalendar
                        events={calendarEvents}
                        doubleClick={handleCalendarDoubleClick}
                        onSelectSlot={handleSelectSlot}
                    />
                </Card>
            </ContainerInput>
            <ContainerButton>
                <Button type="submit" disabled={isSubmitting}>
                    <span>{isSubmitting ? "Guardando..." : "Guardar"}</span>
                </Button>
                <CancelButton onClick={handleCancel} />
            </ContainerButton>
        </form>
    );
};