/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { StudentContext } from "../../context/StudentProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StudentSchema } from "../../models/schemas/StudentSchema";
import { postApi } from "../../services/axiosServices/ApiService";
import { closeFormModal, customAlert } from "../../utils/domHelper";
import { ContainerInput } from "../login/ContainerInput";
import { Input } from "../login/Input";
import { Validate } from "./components/Validate";
import { ContainerButton } from "../login/ContainerButton";
import { Button } from "../login/Button";
import CancelButton from "./components/CancelButon";
import { DateInput } from "./components/DateInput";
import { useExamns } from "../../hooks/fetchExamns";


export const FormStudent = ({examnID}) => {
  const { addStudent } = useContext(StudentContext);
  const [response, setResponse] = useState(false);
  const { getExamnById } = useExamns();
  const [title, setTitle] = useState("")
  const { control, handleSubmit, reset, formState: { errors }, setError } = useForm({
    resolver: zodResolver(StudentSchema)
  });
  const onSubmit = async (data) => {
    setResponse(true);
    try {
      const formData = new FormData();
      formData.append("ci", data.ci);
      formData.append("name", data.name);
      formData.append("paternal_surname", data.paternal_surname);
      formData.append("maternal_surname", data.maternal_surname);
      formData.append("phone_number", data.phone_number);
      formData.append("birthdate", data.birthdate);
      formData.append("evaluation_id", examnID);
      const response = await postApi("students/save", formData);

      if (response.status === 422) {
        for (const key in response.data.errors) {
          setError(key, { message: response.data.errors[key][0] });
        }
      }
      addStudent(response.data);
      customAlert("Estudiante creado correctamente", "success");
      closeFormModal("registerStudent")
      resetForm();
    } catch (error) {
      if (error.response.status === 403) {
        customAlert("No tienes permisos para crear un estudiante", "error");
      } else {
        customAlert(error.response?.data?.message || "Error al crear el estudiante", "error");
        resetForm();
        closeFormModal("registerStudent")
      }
    } finally {
      setResponse(false);
    }
  }
  const resetForm = () => {
    reset(
      {
        ci: "",
        name: "",
        paternal_surname: "",
        maternal_surname: "",
        phone_number: "",
        birthdate: "",
      }
    );
  }
  const handleCancel = () => {
    resetForm();
    closeFormModal("registerStudent")
  }
  useEffect(() => {
    const fetchTitle = async () => {
        const examTitle = await getExamnById(examnID)
        setTitle(examTitle)
    }
    if (examnID) {
        fetchTitle()
    }
}, [examnID])
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ContainerInput>
        <strong>Evaluation: {title}</strong>
      </ContainerInput>  
      <ContainerInput>
        <Input type="text" placeholder="Ingrese el numero de ci" name="ci" control={control} />
        <Validate error={errors.ci} />
      </ContainerInput>
      <ContainerInput>
        <Input type="text" placeholder="Ingrese el nombre" name="name" control={control} />
        <Validate error={errors.name} />
      </ContainerInput>
      <ContainerInput>
        <Input type="text" placeholder="Ingrese el apellido paterno" name="paternal_surname" control={control} />
        <Validate error={errors.paternal_surname} />
      </ContainerInput>
      <ContainerInput>
        <Input type="text" placeholder="Ingrese el apellido materno" name="maternal_surname" control={control} />
        <Validate error={errors.maternal_surname} />
      </ContainerInput>
      <ContainerInput>
        <label htmlFor="phone_number">Número de teléfono</label>
        <div className="input-group">
          <Input
            type="tel"
            placeholder="Ej: 71234567"
            name="phone_number"
            control={control}
          />
        </div>
        <Validate error={errors.phone_number?.message} />
      </ContainerInput>
      <ContainerInput>
        <DateInput type="date" name="birthdate" control={control} label="Fecha de Nacimiento" />
        <Validate error={errors.birthdate} />
      </ContainerInput>
      <ContainerButton>
        <Button type="submit" disabled={response}>
          {response ? "Guardando..." : "Guardar"}
        </Button>
        <CancelButton onClick={handleCancel} disabled={response} />
      </ContainerButton>
    </form>
  )
}
