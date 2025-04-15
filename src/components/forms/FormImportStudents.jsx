import { useState } from "react";
import { postApi } from "../../services/axiosServices/ApiService";
import { closeFormModal, customAlert } from "../../utils/domHelper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImportStudentsSchema } from "../../models/schemas/ImportStudentsSchema";
import { ContainerInput } from "../login/ContainerInput";
import { InputFile } from "./components/InputFile";
import { ContainerButton } from "../login/ContainerButton";
import { Button } from "../login/Button";
import CancelButton from "./components/CancelButon";

export const FormImportStudents = () => {
    const [response, setResponse] = useState(false);

    const {  
        handleSubmit, 
        reset, 
        setValue, 
        setError, 
        formState: { errors } 
    } = useForm({
        resolver: zodResolver(ImportStudentsSchema)
    });

    const onSubmit = async (data) => {
        setResponse(true)
        // Validar si el archivo existe
        if (!data.file) {
            setError("file", { type: "custom", message: "Debes subir un archivo Excel válido" });
            setResponse(false);
            return;
        }

        const formData = new FormData();
        formData.append("file", data.file);

        try {
            const response = await postApi("students/import", formData);
            setResponse(false);

            if (response.status === 422) {
                for (let key in response.data.errors) {
                    setError(key, { type: "custom", message: response.data.errors[key][0] });
                }
                return;
            }

            customAlert("Estudiantes importados correctamente", "success");
            closeFormModal("importarEstudiantes");
            reset();
        } catch (error) {
            setResponse(false);
            customAlert("Error al importar los estudiantes", "error");
            console.error("Error en la importación:", error);
        }
    };

    const handleCancel = () => {
        closeFormModal("importarEstudiantes");
    };

    const handleFile = (file) => {
        
        if (file) {
            if (file.name.match(/\.(xlsx|xls|csv)$/i)) {
                setValue("file", file, { shouldValidate: true });
            } else {
                setError("file", { type: "custom", message: "Formato de archivo no permitido" });
            }
        } else {
            setError("file", { type: "custom", message: "Debes seleccionar un archivo" });
        }
    };
    

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <ContainerInput>
                <h3 className="h5 mb-3">Importar Estudiantes</h3>
            </ContainerInput>
            <ContainerInput>
                <InputFile onChange={handleFile}/>
                {errors.file && <span className="text-danger">{errors.file.message}</span>}
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
