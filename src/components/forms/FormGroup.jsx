/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { GroupContext } from "../../context/GroupsProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GroupSchema } from "../../models/schemas/GroupSchema";
import { postApi } from "../../services/axiosServices/ApiService";
import { closeFormModal, customAlert } from "../../utils/domHelper";
import { ContainerInput } from "../login/ContainerInput";
import { Input } from "../login/Input";
import { Validate } from "./components/Validate";
import { ContainerButton } from "../login/ContainerButton";
import { Button } from "../login/Button";
import CancelButton from "./components/CancelButon";
import { DateInput } from "./components/DateInput";
import { fetchLabs } from "../../hooks/fetchLabs";
import { SelectInput } from "./components/SelectInput";
import { useParams } from "react-router-dom";
import { fetchEvaluationById } from "../../hooks/fetchExamns";

export const FormGroup = () => {
    const { id } = useParams();
    const { examns, getDataExamns } = fetchEvaluationById();
    const [response, setResponse] = useState(false);
    const { addGroup } = useContext(GroupContext);
    const { labs, getDataLabs } = fetchLabs();
    const [array, setArray] = useState([]);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
        setError,
        setValue,
        watch,
    } = useForm({
        resolver: zodResolver(GroupSchema),
        defaultValues: {
            name: "",
            description: "",
            start_time: "",
            end_time: "",
            laboratory_id: "",
            order_type: "",
        },
    });

    const startTime = watch("start_time");
    const endTime = watch("end_time");

    useEffect(() => {
        getDataLabs();
    }, []);

    useEffect(() => {
        getDataExamns(id);
    }, [id]);

    const evaluationId = id;

    useEffect(() => {
        if (labs.length > 0) {
            const array = labs.map((lab) => ({
                value: lab.id,
                text: `${lab.name} - ${lab.location}`,
            }));
            setArray(array);
        }
    }, [labs]);

    useEffect(() => {
        if (!startTime || !/^\d{2}:\d{2}$/.test(startTime) || !examns?.time) return

        const [hours, minutes] = startTime.split(":").map(Number)
        if (isNaN(hours) || isNaN(minutes)) return

        const totalMinutes = hours * 60 + minutes + parseInt(examns.time)
        const endHours = Math.floor(totalMinutes / 60) % 24
        const endMinutes = totalMinutes % 60

        const formattedEndTime = `${endHours.toString().padStart(2, "0")}:${endMinutes
            .toString()
            .padStart(2, "0")}`

        setValue("end_time", formattedEndTime)
    }, [startTime, examns?.time])


    const onSubmit = async (data) => {
        setResponse(true);
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("evaluation_id", evaluationId);
        formData.append("start_time", data.start_time); // Enviar como HH:mm
        formData.append("end_time", data.end_time); // Enviar como HH:mm
        formData.append("laboratory_id", data.laboratory_id);
        formData.append("order_type", data.order_type);

        try {
            const response = await postApi("groups/save", formData);
            if (!response) {
                throw new Error("No se pudo guardar el grupo");
            }
            if (response.status === 422) { // Asumiendo que el éxito es 201 Created
                for (let key in response.data.errors) {
                    setError(key, { type: "custom", message: response.data.errors[key][0] });
                }
                return;
            }
            customAlert("Grupo guardado correctamente", "success");
            closeFormModal("registerGroup");
            addGroup(response.data);
            resetForm();
        } catch (error) {
            
            if (error.response?.status === 403) {
                customAlert("No tienes permisos para guardar el grupo", "error");
            } else {
                customAlert(error.response?.data?.message, "error");
            }
            closeFormModal("registerGroup");
            resetForm();
        } finally {
            setResponse(false);
        }
    };

    const resetForm = () => {
        reset({
            name: "",
            description: "",
            start_time: "",
            end_time: "",
            laboratory_id: "",
            order_type: "",
        });
    };

    const handleCancel = () => {
        resetForm();
        closeFormModal("registerGroup");
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
                <span className="text-align-center text-danger">Tiempo del examen {examns.time || "N/A"} minutos</span>
            </div>
            <ContainerInput>
                <Input name="name" placeholder="Ingrese el Nombre del grupo" control={control} errors={errors} />
                <Validate errors={errors.name} />
            </ContainerInput>
            <ContainerInput>
                <Input name="description" placeholder="Ingrese la descripción del grupo" control={control} errors={errors} />
                <Validate errors={errors.description} />
            </ContainerInput>
            <ContainerInput>
                <p className="text-xs text-gray-500 mt-1">
                    La hora de fin se calcula automáticamente según la duración del examen.
                </p>
                <div style={{ display: "flex", gap: "10px", justifyContent: "space-around" }}>
                    <DateInput label={"Hora de inicio"} name={"start_time"} control={control} type={"time"} />
                    <DateInput label={"Hora de Fin"} name={"end_time"} control={control} type={"time"} disabled />
                </div>
                <Validate errors={errors.start_time} />
                <Validate errors={errors.end_time} />
            </ContainerInput>
            <ContainerInput>
                <SelectInput label="Seleccione un Ambiente" name="laboratory_id" options={array} control={control} />
                <Validate errors={errors.laboratory_id} />
            </ContainerInput>
            <ContainerInput>
                <SelectInput
                    label="Seleccione el tipo de ordenamiento"
                    name="order_type"
                    options={[
                        { value: "id_asc", text: "Por ID (ascendente)" },
                        { value: "alphabetical", text: "Por Apellido (A-Z)" },
                    ]}
                    control={control}
                />
                <Validate errors={errors.order_type} />
            </ContainerInput>

            <ContainerButton>
                <Button type="submit" name="submit" disabled={response}>
                    <span>{response ? "Guardando..." : "Guardar"}</span>
                </Button>
                <CancelButton disabled={response} onClick={handleCancel} />
            </ContainerButton>
        </form>
    );
};