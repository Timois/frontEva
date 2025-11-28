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
        control,
        handleSubmit,
        reset,
        formState: { errors },
        setError,
        watch,
        setValue,
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

    // -------------- BUSCAR LABS Y EXAMEN -------------------
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

    // -------------- FILTRO DE LABORATORIOS -------------------
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

    // -------------- ENVIAR FORMULARIO -------------------
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
            start_time: data.start_time, // formato ISO 8601 ya valido
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

    const resetForm = () => {
        reset();
    };

    // -------------- UI -------------------
    const doubleClick = (event) => {
        alert(JSON.stringify(event, null, 4));
    };

    return (
        <>
            <div className="card p-3 mb-3">
                <h5>Seleccionar Laboratorios</h5>

                <form>
                    <input
                        value={filterValue}
                        onChange={onFilterChange}
                        type="search"
                        placeholder="Buscar por carrera..."
                    />
                </form>

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
                <Card className="card align-items-center h-auto gap-3 p-3">
                    <BigCalendar labs={labs} doubleClick={doubleClick} />
                </Card>
            </ContainerInput>
            <div className="d-flex justify-content-end mt-3">
                <button
                    className="btn btn-secondary me-2"
                    onClick={resetForm}
                    disabled={isSubmitting}
                >
                    Resetear
                </button>

                <button
                    className="btn btn-primary"
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Guardando..." : "Guardar grupos"}
                </button>
            </div>
        </>
    );
};
