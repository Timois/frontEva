/* eslint-disable react/prop-types */
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AssignCareerSchema } from "../../models/schemas/AssignCareerSchema";
import { postApi } from "../../services/axiosServices/ApiService";
import { closeFormModal, customAlert } from "../../utils/domHelper";
import { ContainerInput } from "../login/ContainerInput";
import { SelectInput } from "./components/SelectInput";
import { ContainerButton } from "../login/ContainerButton";
import CancelButton from "./components/CancelButon";
import { Button } from "../login/Button";
import PropTypes from 'prop-types';
import { useFetchCareer } from "../../hooks/fetchCareers";
import { useContext, useEffect, useState } from "react";
import { CareerContext } from "../../context/CareerProvider";

export const AssignCareer = ({ data, personaId }) => {
  const [response, setResponse] = useState(null);
  const { control, handleSubmit, reset, setValue, formState: { errors }, setError } =
    useForm({
      resolver: zodResolver(AssignCareerSchema),
    });
  const { getDataCareer } = useFetchCareer()
  const [array, setArray] = useState([]);
  const { careers } = useContext(CareerContext);

  useEffect(() => {
    if (personaId) {
      setValue("user_id", personaId);
    }
  }, [personaId, setValue]);

  const onSubmit = async (formData) => {
    setResponse(true);

    const form = new FormData();
    form.append("career_id", formData.career_id);
    form.append("user_id", formData.user_id || personaId); // Usar personaId como respaldo

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
      console.error("Error al asignar carrera:", error);
      customAlert("Error al asignar carrera", "error");
    } finally {
      setResponse(false);
    }
  };
  const formatData = () => {
    const newArray = data?.careers.map((element) => ({
      value: element.id,
      text: element.name,
    }));
    setArray(newArray);
  }
  const onError = (errors) => {
    console.log("Errores de validación:", errors);
  };
  const handleCancel = () => {
    closeFormModal("asignarCarrera");
    reset();
  };
  useEffect(() => {
    getDataCareer()
  }, [])
  useEffect(() => {
    formatData()
  }, [careers])
  return (
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      <ContainerInput>
        <SelectInput
          label="Seleccione una carrera"
          name="career_id"
          options={array}
          control={control}
          errors={errors.career_id}
        />
      </ContainerInput>

      {/* Solo mostrar el selector de usuario si no se proporciona personaId */}
      {!personaId && (
        <ContainerInput>
          <SelectInput
            label="Seleccione un usuario"
            name="user_id"
            options={data?.users}
            control={control}
            error={errors.user_id}
          />
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