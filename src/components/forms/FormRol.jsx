import { useContext, useEffect, useState } from "react";
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
import CancelButton from "./components/CancelButon";
import { useNavigate } from "react-router-dom"; // Importar useNavigate
import { useFetchPermission } from "../../hooks/fetchPermissions";

export const FormRol = () => {
    const navigate = useNavigate(); // Inicializar useNavigat
    const { addRol } = useContext(RolContext);
    const [response, setResponse] = useState(false);
    const { permisos, getData } = useFetchPermission();
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

    const onSubmit = async (data) => {
        setResponse(true);

        const formData = {
            name: data.name,
            permissions: selectedPermisos
        };

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

            addRol(response);
            customAlert("Rol Guardado", "success");
            resetForm();

            // Redirigir a la vista de roles después de guardar el rol
            navigate("/administracion/roles"); // Cambiar la ruta según la necesidad
        } catch (error) {
            customAlert(error.response?.data.errors?.name?.[0], "error");
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

        // Redirigir a la vista de roles al hacer clic en cancelar
        navigate("/administracion/roles"); // Cambiar la ruta según la necesidad
    };

    // Nueva función para agrupar permisos
    const getGroupedPermissions = () => {
        const groups = {};
        permisos.forEach(permiso => {
            // Asumiendo que el nombre del permiso tiene formato "categoria-accion"
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
                    control={control}
                    type="text"
                    placeholder="Ingrese un rol"
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
                        <h4 className="text-lg font-semibold mb-3">Permisos disponibles:</h4>
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
                <CancelButton
                    disabled={response}
                    onClick={handleCancel}
                /> 
            </ContainerButton>
        </form>
    );
};
