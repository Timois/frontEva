/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { AreaContext } from "../../context/AreaProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AreaSchema } from "../../models/schemas/AreaSchema";
import { postApi } from "../../services/axiosServices/ApiService";
import { closeFormModal, customAlert } from "../../utils/domHelper";
import { ContainerInput } from "../login/ContainerInput";
import { Input } from "../login/Input";
import { Validate } from "../forms/components/Validate";
import { ContainerButton } from "../login/ContainerButton";
import { Button } from "../login/Button";
import CancelButton from "../forms/components/CancelButon";
import { CareerContext } from "../../context/CareerProvider";

export const EditArea = ({ data, closeModal }) => {
  const { updateArea } = useContext(AreaContext);
  const { careers } = useContext(CareerContext); // Obtener carreras del contexto
  const [response, setResponse] = useState(false);
  const [careerName, setCareerName] = useState(""); // Estado para el nombre de la carrera

  const { control, handleSubmit, reset, setValue, formState: { errors }, setError } = useForm({
    resolver: zodResolver(AreaSchema),
  });

  useEffect(() => {
    if (data) {
      setValue("name", data.name);
      setValue("description", data.description);

      // Buscar el nombre de la carrera asociada
      const career = careers.find(c => c.id === data.career_id);
      setCareerName(career ? career.name : "Carrera no encontrada");

      // Asegurar que career_id esté asignado pero no editable
      setValue("career_id", data.career_id);
    }
  }, [data, setValue, careers]);

  const onSubmit = async (formData) => {
    setResponse(true);

    const requestData = new FormData();
    requestData.append("name", formData.name);
    requestData.append("description", formData.description);

    try {
      const response = await postApi(`areas/edit/${data.id}`, requestData);
      setResponse(false);

      if (response.status === 422) {
        for (let key in response.data.errors) {
          setError(key, { type: "custom", message: response.data.errors[key][0] });
        }
        return;
      }

      customAlert("Área Editada", "success");
      closeFormModal("editarArea");
      updateArea(response);
      reset();
    } catch (error) {
      console.error("Error al actualizar área:", error);
      setResponse(false);
    }
  };
  const handleCancel = () => {
    closeModal();
  }

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
        {/* Este es solo un campo de visualización, no conectado al formulario */}
        <div className="form-control" style={{ backgroundColor: "#f8f9fa", width: "100%" }}>
          {careerName}
        </div>

        {/* El campo real que se enviará */}
        <Input
          name="career_id"
          control={control}
          type="hidden"  // Oculto para que no se vea en la interfaz
        />
      </ContainerInput>
      <ContainerButton>
        <Button type="submit" name="submit" disable={response}>
          <span>{response ? "Guardando..." : "Guardar"}</span>
        </Button>
        <CancelButton disabled={response} onClick={handleCancel} />
      </ContainerButton>
    </form>
  );
};
