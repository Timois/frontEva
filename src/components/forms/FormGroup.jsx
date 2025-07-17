/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
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
import { fetchLabs } from "../../hooks/fetchLabs";
import { SelectInput } from "./components/SelectInput";
import { useParams } from "react-router-dom";
import { useExamns } from "../../hooks/fetchExamns";
import { fetchGroupByEvaluation } from "../../hooks/fetchGroup";
const arrayOption = [
    { value: "turno1", text: "Turno 1" }, { value: "turno2", text: "Turno 2" }, { value: "turno3", text: "Turno 3" }, { value: "turno4", text: "Turno 4" }
];
const ordens = [
    { value: "id_asc", text: "Por ID (ascendente)" },
    { value: "alphabetical", text: "Por Apellido (A-Z)" },
]
export const FormGroup = () => {
    const { id } = useParams();
    const { examn, getExamnById } = useExamns()
    const [response, setResponse] = useState(false);
    const { refreshGroups } = fetchGroupByEvaluation();
    const { labs, getDataLabs } = fetchLabs();
    const [array, setArray] = useState([]);
    const isEdit = false;
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
        setError,
    } = useForm({
        resolver: zodResolver(GroupSchema(isEdit)),
        defaultValues: {
            name: "",
            description: "",
            laboratory_id: null,
            order_type: "",
        },
    });

    useEffect(() => {
        getDataLabs();
    }, []);

    useEffect(() => {
        getExamnById(id);
    }, [id]);

    const evaluationId = id;

    useEffect(() => {
        if (labs.length > 0) {
            const newArray = labs.map((lab) => ({
                value: lab.id,
                text: `${lab.name} - ${lab.location}`,
            }));
            setArray(newArray);
        }
    }, [labs]);

    const onSubmit = async (data) => {
        
        setResponse(true);
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("evaluation_id", evaluationId);
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
            await refreshGroups(evaluationId); // Refrescar la list
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
            laboratory_id: "",
            order_type: "",
        });
    };

    const handleCancel = () => {
        resetForm();
        closeFormModal("registerGroup");
    };
    const onError = (errors) => {
        // console.log("Errores del formulario:", errors);
      };
    return (
        <form onSubmit={handleSubmit(onSubmit, onError)}>
            <div className="mb-3">
                <span className="text-align-center text-danger">Tiempo del examen {examn.time || "N/A"} minutos</span>
            </div>
            <ContainerInput>
                <Input name="name" placeholder="Ingrese el Nombre del grupo" control={control} errors={errors} />
                <Validate errors={errors.name} />
            </ContainerInput>
            <ContainerInput>
                <SelectInput label="Seleccione una opcion" name="description" options={arrayOption} control={control} />
                <Validate errors={errors.description} />
            </ContainerInput>
            <ContainerInput>
                <SelectInput label="Seleccione un Ambiente" name="laboratory_id" options={array} control={control} castToNumber={true} />
                <Validate errors={errors.laboratory_id} />
            </ContainerInput>
            <ContainerInput>
                <SelectInput
                    label="Seleccione el tipo de ordenamiento"
                    name="order_type"
                    options={ordens}
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