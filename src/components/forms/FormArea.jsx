import { useContext, useState } from "react";
import { AreaContext } from "../../context/AreaProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AreaSchema } from "../../models/schemas/AreaSchema";
import { closeFormModal, customAlert } from "../../utils/domHelper";
import { postApi } from "../../services/axiosServices/ApiService";
import { ContainerInput } from "../login/ContainerInput";
import { Input } from "../login/Input";
import { Validate } from "./components/Validate";
import { Button } from "../login/Button";
import { ContainerButton } from "../login/ContainerButton";
import CancelButton from "./components/CancelButon";

export const FormArea = () => {
    const { addArea } = useContext(AreaContext);
    const [response, setResponse] = useState(false);

    // Obtener el career_id desde el localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    const career_id = user?.career_id;

    // Hook de formularios con validaciones
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
        setError,
    } = useForm({
        resolver: zodResolver(AreaSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    });

    const onSubmit = async (data) => {
        setResponse(true);

        // Validar que career_id exista antes de enviar
        if (!career_id) {
            customAlert("No se encontró el ID de carrera del usuario", "error");
            setResponse(false);
            return;
        }

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("career_id", career_id); // Enviar ID directamente

        try {
            const response = await postApi("areas/save", formData);
            setResponse(false);

            if (response.status === 422) {
                for (const key in response.data.errors) {
                    setError(key, {
                        type: "custom",
                        message: response.data.errors[key][0],
                    });
                }
                return;
            }

            addArea(response);
            customAlert("Área Guardada", "success");
            closeFormModal("registroArea");
            resetForm();
        } catch (error) {
            console.error("Error al guardar área:", error);
            setResponse(false);
            customAlert("Error al guardar el área", "error");
        }
    };

    const resetForm = () => {
        reset({
            name: "",
            description: "",
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <ContainerInput>
                <Input 
                    name="name" 
                    control={control} 
                    type="text" 
                    placeholder="Ingrese el nombre" 
                />
                <Validate error={errors.name} />
            </ContainerInput>
            
            <ContainerInput>
                <Input 
                    name="description" 
                    control={control} 
                    type="text" 
                    placeholder="Ingrese la descripción" 
                />
                <Validate error={errors.description} />
            </ContainerInput>

            <ContainerButton>
                <Button type="submit" name="submit" disable={response}>
                    <span>{response ? "Guardando..." : "Guardar"}</span>
                </Button>
                <CancelButton onClick={resetForm} />
            </ContainerButton>
        </form>
    );
};
