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
import CancelButton from "../forms/components/CancelButon";
import { ContainerInput } from "../login/ContainerInput";
import { Input } from "../login/Input";
import { Validate } from "../forms/components/Validate";
import { useFetchPermission } from "../../hooks/fetchPermissions";

export const EditRol = ({ data }) => {
    const navigate = useNavigate();
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
        defaultValues: {
            name: data.name
        }
    });
    
    useEffect(() => {
        if (data && data.permissions) {
            setValue('name', data.name);
            // Asegurarse de que permissions sea un array y manejar diferentes estructuras
            const permissionsList = Array.isArray(data.permissions) 
                ? data.permissions
                : Object.values(data.permissions);
            
            const permissionNames = permissionsList.map(p => 
                typeof p === 'string' ? p : p.name
            );
            setSelectedPermisos(permissionNames);
        }
    }, [data, setValue]);
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
            id: data.id,
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
            // Asegurarse de que la respuesta incluya los permisos actualizados
            const updatedRole = {
                ...response,
                permissions: selectedPermisos.map(name => ({ name }))
            };
            updateRol(updatedRole);
            customAlert("Rol Actualizado", "success");
            navigate("/administracion/roles");
        } catch (error) {
            customAlert(error.response?.data.errors?.name?.[0] || "Error al actualizar el rol", "error");
        } finally {
            setResponse(false);
        }
    };

    // Redirigir a la vista de roles al hacer clic en cancelar
    const handleCancel = () => {
        navigate("/administracion/roles"); // Asegúrate de que esta sea la ruta correcta de roles
    };

    // Agregar función para agrupar permisos
    const getGroupedPermissions = () => {
        const groups = {};
        permisos.forEach(permiso => {
            const [category] = permiso.name.split('-');
            if (!groups[category]) {
                groups[category] = [];
            }
            groups[category].push(permiso);
        });
        return groups;
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {Object.entries(getGroupedPermissions()).map(([category, categoryPermisos]) => (
                                <div key={category} className="border rounded-lg p-3">
                                    <h5 className="text-md font-medium text-gray-700 mb-3 capitalize border-b pb-2">
                                        {category}
                                    </h5>
                                    <div className="space-y-2 row">
                                        {categoryPermisos.map((permiso) => (
                                            <div 
                                                key={permiso.id} 
                                                className="flex items-center p-2 hover:bg-gray-50 rounded col-md-4"
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
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <ContainerButton>
            <button
                    type={"submit"}
                    name={"submit"}
                    disabled={response}
                    className="btn rounded-0 btn-lg"
                    style={{ backgroundColor: "#070785", color: "white" }}
                >
                    <span>{response ? "Guardando..." : "Guardar"}</span>
                </button>
                {/* Botón de cancelar redirige a la vista de roles */}
                <CancelButton disabled={response} onClick={handleCancel} />
            </ContainerButton>
        </form>
    );
};
