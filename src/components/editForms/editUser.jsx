/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { UserSchema } from "../../models/schemas/UsersSchema";
import { CareerContext } from "../../context/CareerProvider";
import { useFetchRol } from "../../hooks/fetchRoles";
import { closeFormModal, customAlert } from "../../utils/domHelper";
import { postApi } from "../../services/axiosServices/ApiService";
import { ContainerInput } from "../login/ContainerInput";
import { Input } from "../login/Input";
import { Validate } from "../forms/components/Validate";
import { SelectInput } from "../forms/components/SelectInput";
import { ContainerButton } from "../login/ContainerButton";
import { Button } from "../login/Button";
import CancelButton from "../forms/components/CancelButon";
import { SelectMultiple } from "../forms/components/SelectMultiple";

export const EditUser = ({ data, closeModal }) => {
  const { updateUser } = useContext(UserContext);
  const { roles, loading: loadingRoles, getData } = useFetchRol();
  const { careers } = useContext(CareerContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { 
    control, 
    handleSubmit, 
    reset, 
    setValue, 
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
console.log(errors)
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (data) {
      setValue("name", data.name);
      setValue("email", data.email);
      // Convertir career_id a string si es número
      setValue("career_id", data.career_id ? String(data.career_id) : "");
      // Asegurar que los roles sean strings
      setValue("role", data.roles?.map(role => String(role.id)) || []);
    }
  }, [data, setValue]);

  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    
    try {
      // Preparar datos para el backend
      const requestData = {
        name: formData.name,
        email: formData.email,
        password: formData.password || undefined,
        career_id: formData.career_id ? Number(formData.career_id) : null,
        role: formData.role.map(String) // Asegurar que sean strings
      };

      const response = await postApi(`users/edit/${data.id}`, requestData);
      
      if (response.status === 422) {
        for (const [field, errors] of Object.entries(response.data.errors)) {
          setError(field, {
            type: "server",
            message: Array.isArray(errors) ? errors[0] : errors
          });
        }
        return;
      }

      updateUser(response.data.user);
      customAlert("Usuario actualizado exitosamente", "success");
      closeFormModal("editarUsuario");
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      customAlert(error.response?.data?.message || "Error al actualizar usuario", "error");
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

      <ContainerInput>
        <SelectMultiple
          name="role"
          control={control}
          options={roles.map(role => ({ 
            value: role.id, 
            label: role.name 
          }))}
          label="Seleccione uno o más roles"
          isMulti={true}
        />
        <Validate error={errors.role} />
      </ContainerInput>

      <ContainerButton>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : "Guardar cambios"}
        </Button>
        <CancelButton onClick={handleCancel} disabled={isSubmitting} />
      </ContainerButton>
    </form>
  );
};