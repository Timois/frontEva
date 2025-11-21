/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GroupSchema } from "../../models/schemas/GroupSchema"; // Asegúrate de actualizar este schema también
import { postApi } from "../../services/axiosServices/ApiService";
import { closeFormModal, customAlert } from "../../utils/domHelper";
import { ContainerInput } from "../login/ContainerInput";
import { Input } from "../login/Input";
import { Validate } from "./components/Validate";
import { ContainerButton } from "../login/ContainerButton";
import { Button } from "../login/Button";
import CancelButton from "./components/CancelButon";
import { fetchLabs } from "../../hooks/fetchLabs";
import { useParams } from "react-router-dom";
import { useExamns } from "../../hooks/fetchExamns";
import { fetchGroupByEvaluation } from "../../hooks/fetchGroup";
import { DateInput } from "./components/DateInput";

const ordens = [
    { value: "id_asc", text: "Por ID (ascendente)" },
    { value: "alphabetical", text: "Por Apellido Paterno (A-Z)" },
];

export const FormGroup = () => {
    const { id } = useParams(); // evaluation_id
    const { examn, getExamnById } = useExamns();
    const { refreshGroups } = fetchGroupByEvaluation();
    const { labs, getDataLabs } = fetchLabs();

    const [labOptions, setLabOptions] = useState([]);
    const [selectedLabs, setSelectedLabs] = useState([]); // Para mostrar selección visual
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
        setError,
        watch,
        setValue,
    } = useForm({
        resolver: zodResolver(GroupSchema(false)), // Ajusta tu schema si es necesario
        defaultValues: {
            name: "",
            description: "",
            laboratory_ids: [],        // ← Ahora es array
            start_time: "",
            end_time: "",
            order_type: "alphabetical",
        },
    });

    const startTime = watch("start_time");

    // Cargar laboratorios
    useEffect(() => {
        getDataLabs();
        getExamnById(id);
    }, [id]);

    // Generar opciones de laboratorios
    useEffect(() => {
        if (labs.length > 0) {
            const options = labs.map((lab) => ({
                value: lab.id,
                text: `${lab.name} - ${lab.location} (${lab.equipment_count} equipos)`,
            }));
            setLabOptions(options);
        }
    }, [labs]);

    // Calcular hora de fin automáticamente
    useEffect(() => {
        if (!startTime || !examn?.time || !/^\d{2}:\d{2}$/.test(startTime)) return;

        const [hours, minutes] = startTime.split(":").map(Number);
        const totalMinutes = hours * 60 + minutes + parseInt(examn.time);
        const endHours = Math.floor(totalMinutes / 60) % 24;
        const endMinutes = totalMinutes % 60;

        const formatted = `${endHours.toString().padStart(2, "0")}:${endMinutes
            .toString()
            .padStart(2, "0")}`;

        setValue("end_time", formatted);
    }, [startTime, examn?.time, setValue]);

    // Manejar selección múltiple de laboratorios
    const handleLabChange = (e) => {
        const options = e.target.options;
        const selected = [];
        const selectedIds = [];

        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selected.push(options[i].text);
                selectedIds.push(parseInt(options[i].value));
            }
        }

        setSelectedLabs(selected);
        setValue("laboratory_ids", selectedIds); // Actualiza react-hook-form
    };

    const onSubmit = async (data) => {
        if (data.laboratory_ids.length === 0) {
            customAlert("Debe seleccionar al menos un laboratorio.", "warning");
            return;
        }

        setIsSubmitting(true);

        const formData = new FormData();
        formData.append("evaluation_id", id);
        formData.append("name", data.name.trim());
        if (data.description?.trim()) {
            formData.append("description", data.description.trim());
        }
        formData.append("start_time", data.start_time);
        formData.append("end_time", data.end_time);
        formData.append("order_type", data.order_type);

        data.laboratory_ids.forEach((labId) => {
            formData.append("laboratory_ids[]", labId);
        });

        try {
            const response = await postApi("groups/save", formData);
            if (response.status === 201 || response.status === 200) {
                customAlert(
                    `¡Éxito! Se crearon ${response.data.total_groups_created} grupos en ${response.data.total_turns} turno(s).`,
                    "success"
                );
                closeFormModal("registerGroup");
                await refreshGroups(id);
                resetForm();
            }
        } catch (error) {
            const msg = error.response?.data?.message || "Error al crear los grupos";
            customAlert(msg, "error");

            if (error.response?.status === 422) {
                Object.keys(error.response.data.errors).forEach((key) => {
                    const messages = error.response.data.errors[key];
                    setError(key.replace("laboratory_ids.", "laboratory_ids."), {
                        type: "server",
                        message: messages[0],
                    });
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        reset();
        setSelectedLabs([]);
    };

    const handleCancel = () => {
        resetForm();
        closeFormModal("registerGroup");
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4 text-center">
                <span className="text-lg font-semibold text-blue-600">
                    Tiempo del examen: {examn?.time || "N/A"} minutos
                </span>
            </div>
            <ContainerInput>
                <Input
                    name="name"
                    placeholder="Ej: Examen Final de Matemáticas"
                    control={control}
                    errors={errors}
                    label="Nombre base de los grupos"
                />
                <Validate errors={errors.name} />
            </ContainerInput>
            <ContainerInput>
                <Input
                    name="description"
                    placeholder="Opcional: notas generales para todos los grupos"
                    control={control}
                    errors={errors}
                    label="Descripción general (opcional)"
                />
                <Validate errors={errors.description} />
            </ContainerInput>
            <ContainerInput>
                <p className="text-xs text-gray-600 mb-2">
                    La hora de fin se calcula automáticamente según la duración del examen.
                </p>
                <div className="grid grid-cols-2 gap-4">
                    <DateInput label="Hora de inicio" name="start_time" control={control} type="time" />
                    <DateInput label="Hora de fin (automática)" name="end_time" control={control} type="time" disabled />
                </div>
                <Validate errors={errors.start_time} />
            </ContainerInput>
            <ContainerInput>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selecciona uno o más laboratorios (mantiene 3 equipos de reserva por lab)
                </label>
                <select
                    multiple
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-48 text-sm"
                    onChange={handleLabChange}
                    value={watch("laboratory_ids") || []}
                >
                    {labOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.text}
                        </option>
                    ))}
                </select>
                {selectedLabs.length > 0 && (
                    <div className="mt-2 text-sm text-green-600 font-medium">
                        Seleccionados: {selectedLabs.join(" | ")}
                    </div>
                )}
                <Validate errors={errors.laboratory_ids} />
                <p className="text-xs text-gray-500 mt-1">
                    Mantén presionado Ctrl (o Cmd) para seleccionar varios.
                </p>
            </ContainerInput>
            <ContainerInput>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Orden de asignación de estudiantes
                </label>
                <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    {...control.register("order_type")}
                >
                    <option value="">Seleccione un orden...</option>
                    {ordens.map((orden) => (
                        <option key={orden.value} value={orden.value}>
                            {orden.text}
                        </option>
                    ))}
                </select>
                <Validate errors={errors.order_type} />
            </ContainerInput>
            <ContainerButton>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creando grupos..." : "Crear Grupos Automáticos"}
                </Button>
                <CancelButton onClick={handleCancel} disabled={isSubmitting} />
            </ContainerButton>
        </form>
    );
};