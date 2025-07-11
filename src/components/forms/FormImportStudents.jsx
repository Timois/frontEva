/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import { postApi } from "../../services/axiosServices/ApiService";
import { closeFormModal, customAlert } from "../../utils/domHelper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImportStudentsSchema } from "../../models/schemas/ImportStudentsSchema";
import { ContainerInput } from "../login/ContainerInput";
import { ContainerButton } from "../login/ContainerButton";
import { Button } from "../login/Button";
import { ImputStudents } from "./components/ImputStudents";
import CancelButton from "./components/CancelButon";

export const FormImportStudents = ({ examID, modalId }) => {
    const [response, setResponse] = useState(false);

    const { control,
        handleSubmit,
        reset,
        setValue,
        setError,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(ImportStudentsSchema),
    });

    const onSubmit = async (data) => {
        setResponse(true);

        if (!data.file) {
            setError("file", {
                type: "custom",
                message: "Debes subir un archivo Excel válido",
            });
            setResponse(false);
            return;
        }

        const formData = new FormData();
        formData.append("file", data.file);
        formData.append("evaluation_id", examID);
        try {
            const response = await postApi("students/import", formData)
            if (response) {
                const resumen = response.resumen;

                const resumenMensaje = `✅ Importación completada:
            
            • Total de filas: ${resumen.total_filas}
            • Éxitos: ${resumen.exitosos}
            • Errores: ${resumen.errores}`;

                customAlert(resumenMensaje, "success");

                resetForm();
                closeFormModal(modalId);
                setResponse(false);
                return;
            }
        } catch (error) {
            console.error('Error completo:', error);
            if (error.response && error.response.status === 403) {
                customAlert("No tienes permisos para importar estudiantes", "error");
            } else if (error.response && error.response.data && error.response.data.message) {
                customAlert(error.response.data.message, "error");
            } else {
                customAlert("Error al importar estudiantes. Por favor, verifica el formato del archivo.", "error");
            }
            resetForm();
            closeFormModal(modalId);
            setResponse(false);
        }
    };
    const resetForm = () => {
        reset(
            "file",
            "evaluation_id"
        );
    }
    const handleCancel = () => {
        closeFormModal(modalId);
    };

    const handleFile = (file) => {
        if (file) {
            if (file.name.match(/\.(xlsx|xls|csv)$/i)) {
                setValue("file", file, { shouldValidate: true });
            } else {
                setError("file", {
                    type: "custom",
                    message: "Formato de archivo no permitido",
                });
            }
        } else {
            setError("file", {
                type: "custom",
                message: "Debes seleccionar un archivo",
            });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <ContainerInput>
                <ImputStudents onChange={handleFile} />
                {errors.file && (
                    <span className="text-danger">{errors.file.message}</span>
                )}
            </ContainerInput>
            <ContainerButton>
                <Button type="submit" name="submit" disabled={response}>
                    <span>{response ? "Importando..." : "Importar"}</span>
                </Button>
                <CancelButton disabled={response} onClick={handleCancel} />
            </ContainerButton>
        </form>
    );
};
