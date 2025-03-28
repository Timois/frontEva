/* eslint-disable react/prop-types */
import { useContext, useState, useEffect } from "react";
import { RolContext } from "../../context/RolesProvider";
import { PermissionsContext } from "../../context/PermissionsProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RolSchema } from "../../models/schemas/RolSchema";
import { postApi } from "../../services/axiosServices/ApiService";
import {  closeFormModal, customAlert } from "../../utils/domHelper";
import { ContainerButton } from "../login/ContainerButton";
import { Button } from "../login/Button";
import CancelButton from "../forms/components/CancelButon";
import { ContainerInput } from "../login/ContainerInput";
import { Input } from "../login/Input";
import { Validate } from "../forms/components/Validate";

export const EditRol = ({ data, closeModal }) => {
    const { updateRol } = useContext(RolContext);
    const { permisos } = useContext(PermissionsContext);
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

    // Inicializar con los permisos actuales del rol
    useEffect(() => {
        if (data) {
            setValue("name", data.name);
            if (data.permissions) {
                setSelectedPermisos(data.permissions.map(p => p.id));
            }
        }
    }, [data, setValue]);

    // Función para seleccionar/deseleccionar todos los permisos
    const handleSelectAll = (isChecked) => {
        if (isChecked) {
            const allPermisoIds = permisos.map(permiso => permiso.id);
            setSelectedPermisos(allPermisoIds);
        } else {
            setSelectedPermisos([]);
        }
    };

    // Función para manejar cambios en permisos individuales
    const handlePermisoChange = (permisoId) => {
        setSelectedPermisos(prev => 
            prev.includes(permisoId)
                ? prev.filter(id => id !== permisoId)
                : [...prev, permisoId]
        );
    };

    // Verifica si todos los permisos están seleccionados
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

            updateRol(response.data);
            customAlert("Rol Actualizado", "success");
            closeFormModal("editarRol");
            reset();
        } catch (error) {
            console.error("Error al actualizar el rol:", error);
            customAlert("Error al actualizar el rol", "error");
        } finally {
            setResponse(false);
        }
    };

    const handleCancel = () => {
        closeModal();
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
                    {/* Checkbox para seleccionar todos */}
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

                    {/* Lista de permisos */}
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
                                        checked={selectedPermisos.includes(permiso.id)}
                                        onChange={() => handlePermisoChange(permiso.id)}
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
                <CancelButton disabled={response} onClick={handleCancel} />
            </ContainerButton>
        </form>
    );
};