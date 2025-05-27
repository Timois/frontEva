/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { postApi } from "../../services/axiosServices/ApiService";
import { closeFormModal, customAlert } from "../../utils/domHelper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImportStudentsSchema } from "../../models/schemas/ImportStudentsSchema";
import { ContainerInput } from "../login/ContainerInput";
import { ContainerButton } from "../login/ContainerButton";
import { Button } from "../login/Button";
import { ImputStudents } from "./components/ImputStudents";
import CancelButton from "./components/CancelButon";
import { useFetchStudent } from "../../hooks/fetchStudent";
import { useFetchCareerAssign, useFetchCareerAssignPeriod } from "../../hooks/fetchcareers";

export const FormImportStudents = () => {
    const [response, setResponse] = useState(false);
    const { refreshStudents } = useFetchStudent();
    const [array, setArray] = useState([])
    const {
        handleSubmit,
        reset,
        setValue,
        setError,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(ImportStudentsSchema),
    });
    const user = JSON.parse(localStorage.getItem('user'))
    const career_id = user?.career_id

    const { careerAssignments, getDataCareerAssignments } = useFetchCareerAssign(career_id)
    const { careerAssignmentsPeriods, getDataCareerAssignmentPeriods } = useFetchCareerAssignPeriod()

    // Obtienes los datos de la carrera asignada
    useEffect(() => {
        const fetchData = async () => {
            if (career_id && !isNaN(career_id)) {
                await getDataCareerAssignments();
            }
        }
        fetchData();
    }, [career_id])

    // Cuando careerAssignments esté listo, saco el id de la tabla intermedia
    useEffect(() => {
        const fetchPeriods = async () => {
            if (careerAssignments.length > 0) {
                const { academic_management_career_id } = careerAssignments[0];  // Desestructuramos directamente
                await getDataCareerAssignmentPeriods(academic_management_career_id);
            }
        }
        fetchPeriods();
    }, [careerAssignments]);

    useEffect(() => {
        if (careerAssignmentsPeriods.length > 0) {
            const periodOptions = careerAssignmentsPeriods.map(period => ({
                value: period.id,
                text: `${period.period} (${new Date(period.initial_date).toLocaleDateString()} - ${new Date(period.end_date).toLocaleDateString()})`
            }));
            setArray(periodOptions);
        }
    }, [careerAssignmentsPeriods]);
    const onSubmit = async (data) => {
        setResponse(true);

        if (!data.file) {
            setError("file", {
                type: "custom",
                message: "Debes subir un archivo Excel válido",
            });
            setResponse(false);
            return;
        }

        const formData = new FormData();
        formData.append("file", data.file);
        formData.append("academic_management_period_id", data.academic_management_period_id);
        try {
            const response = await postApi("students/import", formData);
            setResponse(false);

            if (response.status === 422) {
                for (let key in response.data.errors) {
                    setError(key, {
                        type: "custom",
                        message: response.data.errors[key][0],
                    });
                }
                return;
            }

            customAlert("Estudiantes importados correctamente", "success");

            // 🔄 Refrescar la lista de estudiantes
            await refreshStudents();

            closeFormModal("importarEstudiantes");
            resetForm();
        } catch (error) {
            setResponse(false);
            customAlert("Error al importar los estudiantes", "error");
            console.error("Error en la importación:", error);
        }
    };
    const resetForm = () =>{
        reset(
            "file",
            "academic_management_period_id"
        );
    }
    const handleCancel = () => {
        closeFormModal("importarEstudiantes");
    };

    const handleFile = (file) => {
        if (file) {
            if (file.name.match(/\.(xlsx|xls|csv)$/i)) {
                setValue("file", file, { shouldValidate: true });
            } else {
                setError("file", {
                    type: "custom",
                    message: "Formato de archivo no permitido",
                });
            }
        } else {
            setError("file", {
                type: "custom",
                message: "Debes seleccionar un archivo",
            });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <ContainerInput>
                <h3 className="h5 mb-3">Importar Estudiantes</h3>
            </ContainerInput>
            <ContainerInput>
                <ImputStudents onChange={handleFile} />
                {errors.file && (
                    <span className="text-danger">{errors.file.message}</span>
                )}
            </ContainerInput>
            <ContainerButton>
                <Button type="submit" name="submit" disabled={response}>
                    <span>{response ? "Importando..." : "Importar"}</span>
                </Button>
                <CancelButton disabled={response} onClick={handleCancel} />
            </ContainerButton>
        </form>
    );
};
