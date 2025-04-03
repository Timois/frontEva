/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { postApi } from "../../services/axiosServices/ApiService";
import { closeFormModal, customAlert } from "../../utils/domHelper";
import { ContainerInput } from "../login/ContainerInput";
import { SelectInput } from "./components/SelectInput";
import { ContainerButton } from "../login/ContainerButton";
import CancelButton from "./components/CancelButon";
import { Button } from "../login/Button";
import PropTypes from 'prop-types';
import {  useEffect, useState } from "react";
import { useFetchCareer } from "../../hooks/fetchCareers";
import { Validate } from "./components/Validate";
import { AssignCareerSchema } from "../../models/schemas/AssignCareerSchema";

export const AssignCareer = ({ data, personaId }) => {
  const [response, setResponse] = useState(null);
  const { control, handleSubmit, reset, setValue, formState: { errors }, setError } =
    useForm({
      resolver: zodResolver(AssignCareerSchema),
    });
  const { careers, loading, error } = useFetchCareer();

  useEffect(() => {
    if (personaId) {
      setValue("user_id", personaId);
    }
  }, [personaId, setValue]);

  useEffect(() => {
    if (careers.length > 0) {
      setValue("career_id", careers[0].id);
    }
  }, [careers]);

  
  const onSubmit = async (formData) => {
    setResponse(true);
    const form = new FormData();
    form.append("career_id", formData.career_id);
    form.append("user_id", formData.user_id || personaId);

    try {
      const response = await postApi("users/assignCareer", form);

      if (response.status === 422) {
        for (const key in response.data.errors) {
          setError(key, { type: "custom", message: response.data.errors[key][0] });
        }
        setResponse(false);
        return null;
      }
      
      customAlert("Carrera Asignada", "success");
      closeFormModal("asignarCarrera");
      reset();
    } catch (error) {
      if (error.response?.status === 403) {
        setError("career_id", { 
          type: "manual", 
          message: error.response.data.message 
        });
      } else {
        customAlert("Error al asignar carrera", "error");
      }
    } finally {
      setResponse(false);
    }
  };


  const handleCancel = () => {
    closeFormModal("asignarCarrera");
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ContainerInput>
        <SelectInput
          label="Seleccione una carrera"
          name="career_id"
          options={careers.map((career) => ({ value: career.id, text: career.name }))}
          control={control}
          error={errors.career_id}
        />
        <Validate error={errors.career_id} />
      </ContainerInput>

      {!personaId && (
        <ContainerInput>
          <SelectInput
            label="Seleccione un usuario"
            name="user_id"
            options={data?.users}
            control={control}
            error={errors.user_id}
          />
          <Validate error={errors.user_id} />
        </ContainerInput>
      )}

      <ContainerButton>
        <Button type="submit" name="submit" disabled={response}>
          <span>{response ? "Guardando..." : "Guardar"}</span>
        </Button>
        <CancelButton disabled={response} onClick={handleCancel} />
      </ContainerButton>
    </form>
  );
};

AssignCareer.propTypes = {
  data: PropTypes.object,
  personaId: PropTypes.string
};
