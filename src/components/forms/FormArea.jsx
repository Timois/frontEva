/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
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

export const FormArea = () => {
    const { career_id } = useParams(); // Obtener ID de la carrera desde la URL
    const { careers } = useContext(CareerContext);
    const { AddArea } = useContext(AreaContext);
    const [careerName, setCareerName] = useState("");
    const [response, setResponse] = useState(false);
    const { control, handleSubmit, reset, setValue, formState: { errors }, setError } = useForm({
        resolver: zodResolver(AreaSchema),
        defaultValues: {
            name: "",
            description: "",
            career_id: "", // Se actualizará después
        },
    });

    useEffect(() => {
        console.log("Carreras disponibles:", careers);
        console.log("Carrera seleccionada:", career_id);
        if (careers.length > 0) {
            const selectedCareer = careers.find((career) => String(career.id) === String(career_id));
            
            if (selectedCareer) {
                console.log("Carrera encontrada:", selectedCareer.name);
                setCareerName(selectedCareer.name);
                setValue("career_id", selectedCareer.name); // Asegura que el campo se llene correctamente
            } else {
                console.log("Carrera no encontrada");
                setCareerName("Carrera no encontrada");
            }
        }
    }, [careers, career_id, setValue]);

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("career_id", career_id); // Enviar el ID real de la carrera

        const response = await postApi("areas/save", formData);
        setResponse(false);
        if (response.status === 422) {
            for (const key in response.data.errors) {
                setError(key, { type: "custom", message: response.data.errors[key][0] });
            }
            return;
        }

        AddArea(response);
        customAlert("Área Guardada", "success");
        closeFormModal("registroArea");
        resetForm();
    };

    const resetForm = () => {
        reset({
            name: "",
            description: "",
            career_id: careerName, // Mantiene la carrera seleccionada
        });
    };

    const handleCancel = () => {
        resetForm();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <ContainerInput>
                <Input name="name" control={control} type="text" placeholder="Ingrese el nombre" />
                <Validate error={errors.name} />
            </ContainerInput>
            <ContainerInput>
                <Input name="description" control={control} type="text" placeholder="Ingrese la descripción" />
                <Validate error={errors.description} />
            </ContainerInput>
            <ContainerInput>
                <Input 
                    name="career_id" 
                    control={control} 
                    type="text" 
                    disabled 
                    value={careerName} // Muestra el nombre de la carrera automáticamente
                />
            </ContainerInput>
            <ContainerButton>
                <Button type="submit" name="submit" disable={response}>
                    <span>{response ? "Guardando..." : "Guardar"}</span>
                </Button>
                <CancelButton onClick={handleCancel} />
            </ContainerButton>
        </form>
    );
};
