/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GroupSchema } from "../../models/schemas/GroupSchema";
import { postApi } from "../../services/axiosServices/ApiService";
import { closeFormModal, customAlert } from "../../utils/domHelper";
import { ContainerInput } from "../login/ContainerInput";
import { Validate } from "./components/Validate";
import { fetchLabs } from "../../hooks/fetchLabs";
import { useParams } from "react-router-dom";
import { useExamns } from "../../hooks/fetchExamns";
import { fetchGroupByEvaluation } from "../../hooks/fetchGroup";
import Select from "react-select";
import { Card } from "../login/Card";
import { BigCalendar } from "./components/BigCalendar";
import { ContainerButton } from "../login/ContainerButton";
import { Button } from "../login/Button";
import CancelButton from "./components/CancelButon";
import { Input } from "../login/Input";
import { DateInput } from "./components/DateInput";

export const FormGroup = () => {
    const { id } = useParams();
    const { examn, getExamnById } = useExamns();
    const { refreshGroups } = fetchGroupByEvaluation();
    const { labs, getDataLabs } = fetchLabs();

    const [labOptions, setLabOptions] = useState([]);
    const [filteredLabs, setFilteredLabs] = useState([]);
    const [filterValue, setFilterValue] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        control, handleSubmit, reset, formState: { errors },
        setError, watch, setValue,
    } = useForm({
        resolver: zodResolver(GroupSchema(false)),
        defaultValues: {
            name: "",
            description: "",
            laboratory_ids: [],
            start_time: "",
            end_time: "",
        },
    });

    // Cargar labs y examen
    useEffect(() => {
        getDataLabs();
        getExamnById(id);
    }, [id]);

    useEffect(() => {
        setFilteredLabs(labs);
    }, [labs]);

    useEffect(() => {
        if (filteredLabs.length > 0) {
            setLabOptions(
                filteredLabs.map((lab) => ({
                    value: lab.id,
                    label: `${lab.name} - ${lab.career?.name || ""}`,
                }))
            );
        }
    }, [filteredLabs]);

    const onFilterChange = (e) => {
        const value = e.target.value;
        setFilterValue(value);

        if (value.trim() === "") {
            setFilteredLabs(labs);
        } else {
            setFilteredLabs(
                labs.filter((lab) =>
                    lab.career?.name?.toLowerCase().includes(value.toLowerCase())
                )
            );
        }
    };

    // ---------------- ENVIAR FORMULARIO -------------------
    const onSubmit = async (data) => {
        if (data.laboratory_ids.length === 0) {
            customAlert("Debe seleccionar al menos un laboratorio.", "warning");
            return;
        }

        setIsSubmitting(true);

        const payload = {
            evaluation_id: parseInt(id),
            laboratory_ids: data.laboratory_ids,
            name: data.name.trim(),
            description: data.description?.trim() || "",
            start_time: data.start_time,
            end_time: data.end_time,
        };

        try {
            const response = await postApi("groups/save", payload);

            if (response.status === 201) {
                customAlert("¡Grupos creados correctamente!", "success");
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
                    setError(key, {
                        type: "server",
                        message: messages[0],
                    });
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => reset();

    const handleCancel = () => {
        resetForm();
    };

    const doubleClick = (event) => {
        alert(JSON.stringify(event, null, 4));
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="card p-3 mb-3">
                <h5>Seleccionar Laboratorios</h5>

                <input
                    value={filterValue}
                    onChange={onFilterChange}
                    type="search"
                    placeholder="Buscar por carrera..."
                    className="form-control mb-2"
                />
                <Controller
                    name="laboratory_ids"
                    control={control}
                    render={({ field }) => (
                        <Select
                            {...field}
                            placeholder="Selecciona los laboratorios"
                            isMulti
                            options={labOptions}
                            value={labOptions.filter((o) =>
                                field.value.includes(o.value)
                            )}
                            onChange={(selected) =>
                                field.onChange(selected.map((i) => i.value))
                            }
                        />
                    )}
                />
                <Validate errors={errors.laboratory_ids} />
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
                />
            </ContainerInput>
            <ContainerInput>
                <p className="text-xs text-gray-600 mb-2">
                    La hora de fin se calcula automáticamente según la duración del examen.
                </p>
                <div style={{ display: "flex", gap: "10px", justifyContent: "space-around" }}>
                    <DateInput label={"Hora de inicio"} name={"start_time"} control={control} type={"time"} />
                    <DateInput label={"Hora de Fin"} name={"end_time"} control={control} type={"time"} disabled />
                </div>
            </ContainerInput>
            <ContainerInput>
                <Card className="card align-items-center h-auto gap-3 p-3">
                    <BigCalendar labs={labs} doubleClick={doubleClick} />
                </Card>
            </ContainerInput>
            <ContainerButton>
                <Button type="submit" name="submit" disabled={isSubmitting}>
                    <span>{isSubmitting ? "Guardando..." : "Guardar"}</span>
                </Button>
                <CancelButton disabled={isSubmitting} onClick={handleCancel} />
            </ContainerButton>
        </form>
    );
};
