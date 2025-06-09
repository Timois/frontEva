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

export const EditArea = ({ data, closeModal }) => {
  const { updateArea } = useContext(AreaContext);
  const [response, setResponse] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    setError
  } = useForm({
    resolver: zodResolver(AreaSchema),
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const career_id = user?.career_id;

  useEffect(() => {
    if (data) {
      setValue("name", data.name);
      setValue("description", data.description);
      setValue("career_id", career_id);
    }
  }, [data, setValue, career_id]);

  const onSubmit = async (formData) => {
    setResponse(true);

    const requestData = new FormData();
    requestData.append("name", formData.name);
    requestData.append("description", formData.description);
    requestData.append("career_id", career_id);
    try {
      const response = await postApi(`areas/edit/${data.id}`, requestData);
      setResponse(false);

      if (response.status === 422) {
        for (let key in response.data.errors) {
          setError(key, {
            type: "custom",
            message: response.data.errors[key][0]
          });
        }
        return;
      }
      
      if (response) {
        updateArea(response);
        customAlert("Área Editada", "success");
        closeFormModal("editarArea");
        reset();
      } else {
        customAlert("La respuesta no contiene el área actualizada", "error");
      }
    } catch (error) {
      console.error("Error al actualizar área:", error);
      setResponse(false);
      customAlert("Error al actualizar el área", "error");
    }
  };

  const handleCancel = () => {
    closeModal();
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

      <Input name="career_id" control={control} type="hidden" />

      <ContainerButton>
        <Button type="submit" name="submit" disable={response}>
          <span>{response ? "Guardando..." : "Guardar"}</span>
        </Button>
        <CancelButton disabled={response} onClick={handleCancel} />
      </ContainerButton>
    </form>
  );
};
