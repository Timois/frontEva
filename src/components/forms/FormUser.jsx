/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserProvider";
import { RolContext } from "../../context/RolesProvider";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserSchema } from "../../models/schemas/UsersSchema";
import { useFetchRol } from "../../hooks/fetchRoles";
import { postApi } from "../../services/axiosServices/ApiService";
import { closeFormModal, customAlert } from "../../utils/domHelper";
import { ContainerInput } from "../login/ContainerInput";
import { Input } from "../login/Input";
import { Validate } from "./components/Validate";
import { ContainerButton } from "../login/ContainerButton";
import { Button } from "../login/Button";
import CancelButton from "./components/CancelButon";
import { SelectInput } from "./components/SelectInput";

// Nuevo componente para los checkboxes de roles
const RoleCheckboxes = ({ control, roles, error }) => {
    return (
        <div className="mb-3">
            <label className="form-label">Roles:</label>
            <div className="d-flex flex-wrap gap-3">
                {roles.map((role) => (
                    <div key={role.id} className="form-check">
                        <Controller
                            name={`roles[${role.id}]`}
                            control={control}
                            defaultValue={false}
                            render={({ field }) => (
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id={`role-${role.id}`}
                                    checked={field.value}
                                    onChange={(e) => field.onChange(e.target.checked)}
                                />
                            )}
                        />
                        <label className="form-check-label" htmlFor={`role-${role.id}`}>
                            {role.name}
                        </label>
                    </div>
                ))}
            </div>
            {error && <div className="text-danger small">{error.message}</div>}
        </div>
    );
};

export const FormUser = () => {
    const { addUser } = useContext(UserContext);
    const { roles } = useContext(RolContext);
    const [response, setResponse] = useState(false);
    const [selectedCareers, setSelectedCareers] = useState([]);
    const { control, handleSubmit, reset, formState: { errors }, setError } =
        useForm({ 
            resolver: zodResolver(UserSchema),
            defaultValues: {
                roles: {}
            }
        });

    const { getData } = useFetchRol();
    useEffect(() => {
        getData();
    }, [getData]);

    const onSubmit = async (data) => {
        setResponse(true);
        
        // Transformar los checkboxes de roles en un array de IDs de roles seleccionados
        const selectedRoleIds = Object.entries(data.roles || {})
            .filter(([_, isSelected]) => isSelected)
            .map(([roleId]) => Number(roleId));
        
        // Verificar si al menos un rol está seleccionado
        if (selectedRoleIds.length === 0) {
            setError("roles", { 
                type: "custom", 
                message: "Debe seleccionar al menos un rol" 
            });
            setResponse(false);
            return;
        }
        
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("password", data.password);
        formData.append("password_confirmation", data.password_confirmation);
        formData.append("career_id", data.career_id || "");
        
        // Agregar cada role_id como un item separado en el FormData
        selectedRoleIds.forEach(roleId => {
            formData.append("role_ids[]", roleId);
        });

        try {
            const response = await postApi("users/save", formData);
            if (response.status === 422) {
                for (const key in response.data.errors) {
                    setError(key, { type: "custom", message: response.data.errors[key][0] });
                }
                return;
            }
            addUser(response);
            customAlert("Usuario Guardado", "success");
            closeFormModal("registerUser");
            resetForm();
        } catch (error) {
            console.error("Error al guardar el usuario:", error);
            customAlert("Error al guardar el usuario", "error");
        } finally {
            setResponse(false);
        }
    };

    const resetForm = () => {
        reset({
            name: "",
            email: "",
            password: "",
            password_confirmation: "",
            career_id: "",
            roles: {}
        });
    };

    const handleCancel = () => {
        closeFormModal();
        resetForm();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <ContainerInput>
                <Input name="name" type="text" placeholder="Ingrese un nombre" control={control} />
                <Validate error={errors.name} />
            </ContainerInput>
            <ContainerInput>
                <Input name="email" type="email" placeholder="Ingrese un email" control={control} />
                <Validate error={errors.email} />
            </ContainerInput>
            <ContainerInput>
                <Input name="password" type="password" placeholder="Ingrese una contraseña" control={control} />
                <Validate error={errors.password} />
            </ContainerInput>
            <ContainerInput>
                <Input name="password_confirmation" type="password" placeholder="Confirme la contraseña" control={control} />
                <Validate error={errors.password_confirmation} />
            </ContainerInput>
            <ContainerInput>
                <SelectInput name="career_id" options={selectedCareers} control={control} label="Carrera" />
                <Validate error={errors.career_id} />
            </ContainerInput>
            
            {/* Nuevo bloque para los checkboxes de roles */}
            <RoleCheckboxes 
                control={control} 
                roles={roles || []} 
                error={errors.roles} 
            />
            
            <ContainerButton>
                <Button 
                    type="submit" 
                    name="submit" 
                    disabled={response}
                    className={`${response ? 'opacity-75' : ''}`}
                >
                    <span>{response ? "Guardando..." : "Guardar"}</span>
                </Button>
                <CancelButton disabled={response} onClick={handleCancel} />
            </ContainerButton>
        </form>
    );
};