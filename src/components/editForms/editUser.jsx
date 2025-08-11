/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form"; // Añadimos useWatch
import { UserSchema } from "../../models/schemas/UsersSchema";
import { CareerContext } from "../../context/CareerProvider";
import { useFetchRol } from "../../hooks/fetchRoles";
import { closeFormModal, customAlert } from "../../utils/domHelper";
import { updateApi } from "../../services/axiosServices/ApiService";
import { ContainerInput } from "../login/ContainerInput";
import { Input } from "../login/Input";
import { Validate } from "../forms/components/Validate";
import { SelectInput } from "../forms/components/SelectInput";
import { ContainerButton } from "../login/ContainerButton";
import { Button } from "../login/Button";
import CancelButton from "../forms/components/CancelButon";
import { SelectMultiple } from "../forms/components/SelectMultiple";
import { useFetchPersona } from "../../hooks/fetchPersona";

// Lista de roles que no necesitan carrera
const ROLES_SIN_CARRERA = ["admin", "super-admin", "decano"];

export const EditUser = ({ data, closeModal }) => {
  const { updateUser } = useContext(UserContext);
  const { roles, loading: loadingRoles, getData } = useFetchRol();
  const { careers } = useContext(CareerContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCareerField, setShowCareerField] = useState(true);
  const { refreshUsers} = useFetchPersona();
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
    setError
  } = useForm({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      career_id: null,
      role: []
    }
  });

  // Observar cambios en el campo role
  const selectedRoles = watch("role");

  // Actualizar visibilidad del campo career_id cuando cambian los roles
  useEffect(() => {
    if (selectedRoles && selectedRoles.length > 0) {
      // Verificar si alguno de los roles seleccionados está en la lista de roles sin carrera
      const tieneRolSinCarrera = selectedRoles.some(rol =>
        ROLES_SIN_CARRERA.includes(rol)
      );

      setShowCareerField(!tieneRolSinCarrera);

      // Si tiene un rol sin carrera, limpiar el campo career_id
      if (tieneRolSinCarrera) {
        setValue("career_id", null);
      }
    } else {
      setShowCareerField(true);
    }
  }, [selectedRoles, setValue]);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (data) {
      setValue("name", data.name);
      setValue("email", data.email);
      setValue("career_id", data.career_id ? String(data.career_id) : "");
      setValue("role", data.roles?.map(role => String(role.name)) || []);
    }
  }, [data, setValue]);

  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const requestData = {
        name: formData.name,
        email: formData.email,
        password: formData.password || undefined,
        career_id: showCareerField && formData.career_id ? Number(formData.career_id) : 0,
        role: formData.role.map(String)
      };

      const response = await updateApi(`users/edit/${data.id}`, requestData);

      if (response.status === 422) {
        for (const [field, errors] of Object.entries(response.data.errors)) {
          setError(field, {
            type: "server",
            message: Array.isArray(errors) ? errors[0] : errors
          });
        }
        return;
      }
      updateUser(response.data);
      customAlert("Usuario actualizado exitosamente", "success");
      refreshUsers();
      closeFormModal("editarUsuario");
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      customAlert(error.response?.data?.message || "Error al actualizar usuario", "error");
      closeFormModal("editarUsuario");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    closeModal();
    reset();
  };

  if (loadingRoles) return <div>Cargando roles...</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ContainerInput>
        <Input
          type="text"
          placeholder="Nombre completo"
          name="name"
          control={control}
        />
        <Validate error={errors.name} />
      </ContainerInput>

      <ContainerInput>
        <Input
          type="email"
          placeholder="Correo electrónico"
          name="email"
          control={control}
        />
        <Validate error={errors.email} />
      </ContainerInput>

      <ContainerInput>
        <Input
          type="password"
          placeholder="Contraseña (dejar vacío para no cambiar)"
          name="password"
          control={control}
        />
        <Validate error={errors.password} />
      </ContainerInput>

      <ContainerInput>
        <SelectMultiple
          name="role"
          control={control}
          options={roles.map(r => ({ value: r.name, label: r.name }))}
          label="Seleccione los roles"
          isMulti={true}
        />
        <Validate error={errors.role} />
      </ContainerInput>

      {showCareerField && (
        <ContainerInput>
          <SelectInput
            name="career_id"
            control={control}
            options={careers.map(career => ({
              value: career.id,
              label: career.name,
              text: career.name
            }))}
            label="Seleccione una carrera"
          />
          <Validate error={errors.career_id} />
        </ContainerInput>
      )}

      <ContainerButton>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : "Guardar cambios"}
        </Button>
        <CancelButton onClick={handleCancel} disabled={isSubmitting} />
      </ContainerButton>
    </form>
  );
};