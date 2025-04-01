/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserProvider";
import { RolContext } from "../../context/RolesProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserSchema } from "../../models/schemas/UsersSchema";
import { closeFormModal, customAlert } from "../../utils/domHelper";
import { postApi } from "../../services/axiosServices/ApiService";
import { ContainerInput } from "../login/ContainerInput";
import { Input } from "../login/Input";
import { Validate } from "../forms/components/Validate";
import { ContainerButton } from "../login/ContainerButton";
import { Button } from "../login/Button";
import CancelButton from "../forms/components/CancelButon";
import { SelectInput } from "../forms/components/SelectInput";
import { CareerContext } from "../../context/CareerProvider";

export const EditUser = ({ data, closeModal }) => {
  const { updateUser } = useContext(UserContext);
  const { careers } = useContext(CareerContext);
  const { roles } = useContext(RolContext);
  const [response, setResponse] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState([]);

  const { control, handleSubmit, reset, setValue, formState: { errors }, setError } = useForm({
    resolver: zodResolver(UserSchema)
  });

  useEffect(() => {
    if (data) {
      setValue("name", data.name);
      setValue("email", data.email);
      setValue("career_id", data.career_id || "");
      setSelectedRoles(data.roles ? data.roles.map(role => role.id) : []);
    }
  }, [data, setValue]);

  const handleRoleChange = (roleId) => {
    setSelectedRoles(prev =>
      prev.includes(roleId) ? prev.filter(id => id !== roleId) : [...prev, roleId]
    );
  };

  const onSubmit = async (formData) => {
    setResponse(true);
    try {
      formData.roles = selectedRoles; // Agregar roles seleccionados al formData
      const response = await postApi(`users/edit/${data.id}`, formData);

      if (response.status === 422) {
        for (let key in response.data.errors) {
          setError(key, {
            type: "custom",
            message: response.data.errors[key][0]
          });
        }
        return;
      }
      
      updateUser(response.data);
      customAlert("Usuario Actualizado", "success");
      closeFormModal("editarUsuario");
      reset();
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      customAlert("Error al actualizar el usuario", "error");
    } finally {
      setResponse(false);
    }
  };

  const handleCancel = () => {
    closeFormModal("editarUsuario");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ContainerInput>
        <Input name="name" type="text" placeholder="Ingrese el nombre" control={control} />
        <Validate error={errors.name} />
      </ContainerInput>
      <ContainerInput>
        <Input name="email" type="email" placeholder="Ingrese el email" control={control} />
        <Validate error={errors.email} />
      </ContainerInput>
      <ContainerInput>
        <Input name="password" type="password" placeholder="Ingrese la contraseña" control={control} />
        <Validate error={errors.password} />
      </ContainerInput>
      <ContainerInput>
        <Input name="password_confirmation" type="password" placeholder="Confirme la contraseña" control={control} />
        <Validate error={errors.password_confirmation} />
      </ContainerInput>
      <ContainerInput>
        <SelectInput
          name="career_id"
          control={control}
          label="Carrera"
          options={careers}
          error={errors.career_id}
        />
        <Validate error={errors.career_id} />
      </ContainerInput>

      {/* Checkboxes para roles */}
      <ContainerInput>
        <label>Roles</label>
        <div className="d-flex flex-wrap">
          {roles.map(role => (
            <div key={role.id} className="form-check me-3">
              <input
                className="form-check-input"
                type="checkbox"
                id={`role-${role.id}`}
                checked={selectedRoles.includes(role.id)}
                onChange={() => handleRoleChange(role.id)}
              />
              <label className="form-check-label" htmlFor={`role-${role.id}`}>
                {role.name}
              </label>
            </div>
          ))}
        </div>
      </ContainerInput>

      <ContainerButton>
        <Button type="submit" name="submit" disabled={response} className={`${response ? 'opacity-75' : ''}`}>
          <span>{response ? "Actualizando..." : "Actualizar"}</span>
        </Button>
        <CancelButton disabled={response} onClick={handleCancel} />
      </ContainerButton>
    </form>
  );
};
