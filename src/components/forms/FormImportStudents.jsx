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
import { useIdempotentSubmit } from "../../hooks/useIdempotentSubmit";

export const FormImportStudents = ({ examID, modalId }) => {
    const [response, setResponse] = useState(false);
    const [inputKey, setInputKey] = useState(0); // 🔑 fuerza reset del file
    const {start,end,isSubmitting,idempotencyKey,} = useIdempotentSubmit();
    
    const {
        handleSubmit,
        reset,
        setValue,
        setError,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(ImportStudentsSchema),
    });

    const resetForm = () => {
        reset({ file: null });
        setInputKey(prev => prev + 1);
    
        // 🔁 Permite un nuevo intento limpio
        setIdempotencyKey(null);
    };
    
    const onSubmit = async (data) => {
        const key =  start();
        if (!key) return;

        setResponse(true);

        const formData = new FormData();
        formData.append("file", data.file);
        formData.append("evaluation_id", examID);
        formData.append("idempotency_key", idempotencyKey);

        try {
            const response = await postApi("students/import", formData);

            if (response) {
                const resumen = response.resumen;

                customAlert(
                    `✅ Importación completada:
                    • Total de filas: ${resumen.total_filas}
                    • Éxitos: ${resumen.exitosos}
                    • Errores: ${resumen.errores}`,
                    "success"
                );

                resetForm();
                closeFormModal(modalId);
            }
        } catch (error) {
            customAlert(
                error.response?.data?.message || "Error al importar estudiantes",
                "error"
            );
            resetForm();
            closeFormModal(modalId);
        } finally {
            end();
        }
    };

    const handleFile = (file) => {
        if (!file) {
            setError("file", {
                type: "custom",
                message: "Debes seleccionar un archivo",
            });
            return;
        }

        if (!file.name.match(/\.(xlsx|xls|csv)$/i)) {
            setError("file", {
                type: "custom",
                message: "Formato de archivo no permitido",
            });
            return;
        }

        // 🔑 Nuevo intento → nuevo idempotency key
        setIdempotencyKey(crypto.randomUUID());

        setValue("file", file, { shouldValidate: true });
    };


    const handleCancel = () => {
        closeFormModal(modalId);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <ContainerInput>
                <ImputStudents
                    key={inputKey} // 🔑 clave del reset
                    onChange={handleFile}
                />
                {errors.file && (
                    <span className="text-danger">{errors.file.message}</span>
                )}
            </ContainerInput>

            <ContainerButton>
                <Button type="submit" disabled={isSubmitting}>
                    <span>{isSubmitting ? "Importando..." : "Importar"}</span>
                </Button>
                <CancelButton disabled={response} onClick={handleCancel} />
            </ContainerButton>
        </form>
    );
};
