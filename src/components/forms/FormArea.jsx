import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CareerContext } from "../../context/CareerProvider";
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
import { useFetchCareer } from "../../hooks/fetchCareers";

export const FormArea = () => {
    const { career_id } = useParams(); // Obtener ID de la carrera desde la URL
    const { careers } = useContext(CareerContext);
    const { addArea } = useContext(AreaContext);
    const [careerName, setCareerName] = useState("");
    const [response, setResponse] = useState(false);
    const { getDataCareer } = useFetchCareer();

    // Hook de formularios con validaciones
    const { control, handleSubmit, reset, setValue, register, formState: { errors }, setError } = useForm({
        resolver: zodResolver(AreaSchema),
        defaultValues: {
            name: "",
            description: "",
            career_id: career_id, // Asignar el ID de carrera por defecto
        },
    });

    // Cargar las carreras al montar el componente
    useEffect(() => {
        getDataCareer();
    }, []);

    // Buscar la carrera seleccionada después de que careers se actualice
    useEffect(() => {
        if (careers.length > 0 && career_id) {
            const selectedCareer = careers.find((career) => String(career.id) === String(career_id));

            if (selectedCareer) {
                setCareerName(selectedCareer.name);
                // Establece el career_id en el formulario para el envío
                setValue("career_id", career_id);
            } else {
                setCareerName("Carrera no encontrada");
            }
        }
    }, [careers, career_id, setValue]);

    // Función para enviar el formulario
    const onSubmit = async (data) => {
        setResponse(true);
        
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("career_id", career_id); // Usar el ID de carrera de la URL

        try {
            const response = await postApi("areas/save", formData);
            setResponse(false);

            if (response.status === 422) {  
                for (const key in response.data.errors) {
                    setError(key, { type: "custom", message: response.data.errors[key][0] });
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

    // Resetear el formulario manteniendo la carrera seleccionada
    const resetForm = () => {
        reset({
            name: "",
            description: "",
            career_id: career_id, // Mantiene el ID de la carrera seleccionada
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
            
            <ContainerInput>
                {/* Campo visible que muestra el nombre de la carrera */}
                <div className="form-control" style={{ width: '100%' }} >
                    {careerName || "Cargando carrera..."}
                </div>
                
                {/* Campo oculto con el ID de la carrera para el envío del formulario */}
                <input 
                    type="hidden" 
                    {...register("career_id")}
                />
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