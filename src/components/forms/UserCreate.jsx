import { useContext, useEffect, useState } from "react";
import { CareerContext } from "../../context/CareerProvider";
import { UserContext } from "../../context/UserProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserSchema } from "../../models/schemas/UsersSchema";
import { postApi } from "../../services/axiosServices/ApiService";
import { closeFormModal, customAlert } from "../../utils/domHelper";
import { ContainerInput } from "../login/ContainerInput";
import { Input } from "../login/Input";
import { Validate } from "./components/Validate";
import { ContainerButton } from "../login/ContainerButton";
import { Button } from "../login/Button";
import CancelButton from "./components/CancelButon";
import { SelectInput } from "./components/SelectInput";
import { useFetchRol } from "../../hooks/fetchRoles";
import { SelectMultiple } from "./components/SelectMultiple";
import { useFetchPersona } from "../../hooks/fetchPersona";

// Lista de roles que no necesitan carrera
const ROLES_SIN_CARRERA = ["admin", "super-admin", "decano"];

export const UserCreate = () => {
    const { careers } = useContext(CareerContext);
    const { roles, loading: loadingRoles, getData } = useFetchRol();
    const { addUser } = useContext(UserContext);
    const [response, setResponse] = useState(false);
    const [showCareerField, setShowCareerField] = useState(true);
    const { refreshUsers } = useFetchPersona();
    const { control, handleSubmit, reset, watch, setValue, formState: { errors }, setError } = useForm({
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

    const onSubmit = async (data) => {
        setResponse(true);

        try {
            const formData = {
                name: data.name,
                email: data.email,
                password: data.password,
                role: data.role,
                career_id: showCareerField && data.career_id ? data.career_id : null
            };

            const response = await postApi("users/save", formData);

            if (response.status === 422) {
                // Mapear errores del backend
                for (const [field, errors] of Object.entries(response.data.errors)) {
                    setError(field, {
                        type: "server",
                        message: Array.isArray(errors) ? errors[0] : errors
                    });
                }
                return;
            }

            addUser(response.data);
            customAlert("Usuario creado exitosamente", "success");
            refreshUsers();
            closeFormModal("registerUser");
            reset();
        } catch (error) {
            console.error("Error al crear usuario:", error);
            customAlert(error.response?.data?.message || "Error al crear usuario", "error");
        } finally {
            setResponse(false);
        }
    };

    const handleCancel = () => {
        closeFormModal("registerUser");
        reset();
    };

    if (loadingRoles) return <div>Cargando roles...</div>;

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <ContainerInput>
                <Input type="text" placeholder="Nombre completo" name="name" control={control} />
                <Validate error={errors.name} />
            </ContainerInput>
            <ContainerInput>
                <Input type="email" placeholder="Correo electrónico" name="email" control={control} />
                <Validate error={errors.email} />
            </ContainerInput>
            <ContainerInput>
                <Input type="password" placeholder="Contraseña" name="password" control={control} />
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
                        options={careers
                            .filter(c => c.type === 'carrera')
                            .map(c => ({ value: c.id, label: c.name, text: c.name }))}
                        control={control}
                        label="Seleccione una carrera"
                    />
                    <Validate error={errors.career_id} />
                </ContainerInput>
            )}
            <ContainerButton>
                <Button type="submit" disabled={response}>
                    {response ? "Guardando..." : "Guardar"}
                </Button>
                <CancelButton onClick={handleCancel} disabled={response} />
            </ContainerButton>
        </form>
    );
};