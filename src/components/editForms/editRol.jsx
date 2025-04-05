/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate para redirección
import { RolContext } from "../../context/RolesProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RolSchema } from "../../models/schemas/RolSchema";
import { postApi } from "../../services/axiosServices/ApiService";
import { customAlert } from "../../utils/domHelper";
import { ContainerButton } from "../login/ContainerButton";
import { Button } from "../login/Button";
import CancelButton from "../forms/components/CancelButon";
import { ContainerInput } from "../login/ContainerInput";
import { Input } from "../login/Input";
import { Validate } from "../forms/components/Validate";
import { useFetchRol } from "../../hooks/fetchRoles";
import { useFetchPermission } from "../../hooks/fetchPermissions";

export const EditRol = ({ data }) => {
    const navigate = useNavigate(); // Hook para la redirección
    const { updateRol } = useContext(RolContext);
    const { permisos, getData } = useFetchPermission();
    const [response, setResponse] = useState(false);
    const [selectedPermisos, setSelectedPermisos] = useState([]);
    
    const { 
        control, 
        handleSubmit, 
        reset, 
        setValue, 
        formState: { errors }, 
        setError 
    } = useForm({
        resolver: zodResolver(RolSchema),
    });

    useEffect(() => {
        getData();
    }, [getData]);

    const handleSelectAll = (isChecked) => {
        if (isChecked) {
            const allPermisoNames = permisos.map(permiso => permiso.name);
            setSelectedPermisos(allPermisoNames);
        } else {
            setSelectedPermisos([]);
        }
    };

    const handlePermisoChange = (permisoName) => {
        setSelectedPermisos(prev => 
            prev.includes(permisoName)
                ? prev.filter(name => name !== permisoName)
                : [...prev, permisoName]
        );
    };

    const allPermisosSelected = permisos?.length > 0 && 
                               selectedPermisos.length === permisos.length;

    const onSubmit = async (formData) => {
        setResponse(true);
        
        const payload = {
            ...formData,
            permissions: selectedPermisos
        };

        try {
            const response = await postApi(`roles/edit/${data.id}`, payload);
            
            if (response.status === 422) {
                for (let key in response.data.errors) {
                    setError(key, { 
                        type: "custom", 
                        message: response.data.errors[key][0] 
                    });
                }
                return;
            }
            
            updateRol(response);
            customAlert("Rol Actualizado", "success");
            reset();
            
            // Redirigir a la vista de roles después de actualizar el rol
            navigate("/administracion/roles"); // Asegúrate de que esta sea la ruta correcta de roles
        } catch (error) {
            customAlert(error.response?.data.errors?.name?.[0], "error");
        } finally {
            setResponse(false);
        }
    };

    // Redirigir a la vista de roles al hacer clic en cancelar
    const handleCancel = () => {
        navigate("/administracion/roles"); // Asegúrate de que esta sea la ruta correcta de roles
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <ContainerInput>
                <Input 
                    name="name" 
                    type="text" 
                    placeholder="Ingrese el Rol" 
                    control={control} 
                />
                <Validate error={errors.name} />
            </ContainerInput>

            {permisos && permisos.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center p-2 bg-gray-50 rounded">
                        <input
                            type="checkbox"
                            id="select-all"
                            checked={allPermisosSelected}
                            onChange={(e) => handleSelectAll(e.target.checked)}
                            className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <label 
                            htmlFor="select-all" 
                            className="ml-2 text-sm font-medium text-gray-700"
                        >
                            {allPermisosSelected ? "Deseleccionar todos" : "Seleccionar todos"}
                        </label>
                    </div>

                    <div className="border rounded-lg p-4">
                        <h4 className="text-lg font-semibold mb-3">Permisos asignados:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {permisos.map((permiso) => (
                                <div 
                                    key={permiso.id} 
                                    className="flex items-center p-2 hover:bg-gray-50 rounded"
                                >
                                    <input
                                        type="checkbox"
                                        id={`permiso-${permiso.id}`}
                                        checked={selectedPermisos.includes(permiso.name)}
                                        onChange={() => handlePermisoChange(permiso.name)}
                                        className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                    <label 
                                        htmlFor={`permiso-${permiso.id}`} 
                                        className="ml-2 text-sm text-gray-700"
                                    >
                                        {permiso.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <ContainerButton>
                <Button 
                    type="submit" 
                    name="submit" 
                    disabled={response}
                    className={`${response ? 'opacity-75' : ''}`}
                >
                    <span>{response ? "Actualizando..." : "Actualizar"}</span>
                </Button>
                {/* Botón de cancelar redirige a la vista de roles */}
                <CancelButton disabled={response} onClick={handleCancel} />
            </ContainerButton>
        </form>
    );
};
