import { useContext, useEffect, useState } from "react";
import { PermissionsContext } from "../../context/PermissionsProvider";
import { RolContext } from "../../context/RolesProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { RolSchema } from "../../models/schemas/RolSchema";
import { postApi } from "../../services/axiosServices/ApiService";
import { closeFormModal, customAlert } from "../../utils/domHelper";
import { ContainerInput } from "../login/ContainerInput";
import { Input } from "../login/Input";
import { Validate } from "./components/Validate";
import { ContainerButton } from "../login/ContainerButton";
import { Button } from "../login/Button";
import CancelButton from "./components/CancelButon";
import { useFetchPermission } from "../../hooks/fetchPermissions";

export const FormRol = () => {
    const { permisos } = useContext(PermissionsContext);
    const { addRol } = useContext(RolContext);
    const [response, setResponse] = useState(false);
    const [selectedPermisos, setSelectedPermisos] = useState([]);

    const { 
        control, 
        handleSubmit, 
        reset, 
        formState: { errors },
        setError 
    } = useForm({ 
        resolver: zodResolver(RolSchema) 
    });
    const { getData } = useFetchPermission()
    
    useEffect(() => {
        getData();
    }, [getData]);

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

    const onSubmit = async (data) => {
        setResponse(true);
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("permissions", JSON.stringify(selectedPermisos));

        try {
            const response = await postApi("roles/save", formData);
            
            if (response.status === 422) {
                for (const key in response.data.errors) {
                    setError(key, { 
                        type: "custom", 
                        message: response.data.errors[key][0] 
                    });
                }
                return;
            }

            addRol(response.data);
            customAlert("Rol Guardado", "success");
            closeFormModal("registroRol");
            resetForm();
        } catch (error) {
            console.error("Error al guardar el rol:", error);
            customAlert("Error al guardar el rol", "error");
        } finally {
            setResponse(false);
        }
    };

    const resetForm = () => {
        reset({ name: "" });
        setSelectedPermisos([]);
    };

    const handleCancel = () => {
        closeFormModal();
        resetForm();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <ContainerInput>
                <Input 
                    name="name" 
                    control={control} 
                    type="text" 
                    placeholder="Ingrese un rol" 
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
                        <h4 className="text-lg font-semibold mb-3">Permisos disponibles:</h4>
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
                    <span>{response ? "Guardando..." : "Guardar"}</span>
                </Button>
                <CancelButton disabled={response} onClick={handleCancel} />
            </ContainerButton>
        </form>
    );
};