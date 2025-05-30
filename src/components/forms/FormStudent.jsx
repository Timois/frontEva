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
import { useFetchCareerAssign, useFetchCareerAssignPeriod } from "../../hooks/fetchCareers";
import { SelectInput } from "./components/SelectInput";


export const FormStudent = () => {
  const { addStudent } = useContext(StudentContext);
  const [response, setResponse] = useState(false);
  const [array, setArray] = useState([])
  const { control, handleSubmit, reset, formState: { errors }, setError } = useForm({
    resolver: zodResolver(StudentSchema)
  });
  const user = JSON.parse(localStorage.getItem('user'));
  const career_id = user ? user.career_id : null;

  const { careerAssignments, getDataCareerAssignments } = useFetchCareerAssign(career_id)
  const { careerAssignmentsPeriods, getDataCareerAssignmentPeriods } = useFetchCareerAssignPeriod()

  // Obtienes los datos de la carrera asignada
  useEffect(() => {
    const fetchData = async () => {
      if (career_id && !isNaN(career_id)) {
        await getDataCareerAssignments();
      }
    }
    fetchData();
  }, [career_id])

  // Cuando careerAssignments esté listo, saco el id de la tabla intermedia
  useEffect(() => {
    const fetchPeriods = async () => {
      if (careerAssignments.length > 0) {
        const { academic_management_career_id } = careerAssignments[0];  // Desestructuramos directamente
        await getDataCareerAssignmentPeriods(academic_management_career_id);
      }
    }
    fetchPeriods();
  }, [careerAssignments]);

  useEffect(() => {
    if (careerAssignmentsPeriods.length > 0) {
      const periodOptions = careerAssignmentsPeriods.map(period => ({
        value: period.id,
        text: `${period.period}`
      }));
      setArray(periodOptions);
    }
  }, [careerAssignmentsPeriods]);
  const onSubmit = async (data) => {
    if (!data.academic_management_period_id) {
      customAlert("error", "Debe seleccionar un período académico");
      return;
    }
    setResponse(true);
    try {
      const formData = new FormData();
      formData.append("ci", data.ci);
      formData.append("name", data.name);
      formData.append("paternal_surname", data.paternal_surname);
      formData.append("maternal_surname", data.maternal_surname);
      formData.append("phone_number", data.phone_number);
      formData.append("birthdate", data.birthdate);
      formData.append("academic_management_period_id", String(data.academic_management_period_id));

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
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
      <ContainerInput>
        <SelectInput label="Seleccione el periodo" name="academic_management_period_id" options={array} control={control} error={errors.academic_management_period_id} />
        <Validate error={errors.academic_management_period_id} />
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
