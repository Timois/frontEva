import CancelButton from "./components/CancelButon"
import { SelectInput } from "./components/SelectInput"
import { Button } from "../login/Button"
import { ContainerButton } from "../login/ContainerButton"
import { ContainerInput } from "../login/ContainerInput"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { closeFormModal, customAlert } from "../../utils/domHelper"
import { postApi } from "../../services/axiosServices/ApiService"
import { useParams } from "react-router-dom"
import { DateInput } from "./components/DateInput"
import { useContext, useEffect, useState } from "react"
import { PeriodContext } from "../../context/PeriodProvider"
import { Validate } from "./components/Validate"
import { AcademicManagementCareerPeriodSchema } from "../../models/schemas/AcademicManagementCareerPeriodSchema"
export const FormManagementPeriod = () => {
    const { periods } = useContext(PeriodContext);
    const [data, setData] = useState([]);
    useEffect(() => {
        const periodOptions = periods.map((period) => ({
            value: period.id,
            text: period.period
        }));
        setData({ periods: periodOptions });
    }, [periods]);

    const [response, setResponse] = useState(false)
    const { control, handleSubmit, reset, formState: { errors }, setError } = useForm({
        resolver: zodResolver(AcademicManagementCareerPeriodSchema)
    })

    const career_id = useParams().id;

    const getManagementCareerIdByAttr = () => {
        const modal = document.getElementById("asignarPeriodo");
        const academicManagementCareerId = modal?.getAttribute("data-academic_management_career_id");
        return academicManagementCareerId;
    };

    const onSubmit = async (data) => {
        
        setResponse(true)
        const initialDateTime = `${data.initial_date} ${data.initial_time}:00`;
        const endDateTime = `${data.end_date} ${data.end_time}:00`;
        console.log(initialDateTime, endDateTime)
        const academicManagementCareerId = getManagementCareerIdByAttr();

        if (!academicManagementCareerId) {
            console.error("El atributo 'academic_management_career_id' no está definido.");
            return;
        }   
        
        const formData = new FormData();
        formData.append("period_id", data.period_id);
        formData.append("career_id", career_id);
        formData.append("initial_date", initialDateTime);
        formData.append("end_date", endDateTime);
        formData.append("academic_management_career_id", academicManagementCareerId);

        try {
            const response = await postApi("academic_management_period/save", formData)

            if (response.status == 422) {
                for (var key in response.data.errors) {
                    setError(key, { type: "custom", message: response.data.errors[key][0] })
                }
                return null
            }
            customAlert("Periodo Registrado", "success")
            resetForm()
            closeFormModal("asignarPeriodo")
        } catch (error) {
            if(error.response.status == 403){
                customAlert("No tienes permisos para realizar esta acción", "error")
                closeFormModal("asignarPeriodo")
            }else{
                customAlert(error.response?.data?.message || "Error al asignar el periodo", "error") 
                closeFormModal("asignarPeriodo")
            }
        }finally{
           setResponse(false) 
        }
    };
    const resetForm = () => {
        reset({
            period_id: "",
            initial_date: "",
            initial_time: "",
            end_date: "",
            end_time: ""
        });
    }
    // const onError = (errors, e) => console.log(errors, e)
    const handleCancel = () => {
        closeFormModal("asignarPeriodo")
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <ContainerInput>
                <SelectInput
                    label="Seleccione un periodo"
                    name="period_id"
                    options={data.periods}
                    control={control}
                    errors={data.errors}
                    castToNumber={true}
                />
                <Validate error={errors.period_id} />
            </ContainerInput>
            <ContainerInput>
                <div style={{ display: "flex", gap: "10px" }}>
                    <DateInput label={"Fecha de inicio"} name={"initial_date"} control={control} type={"date"} />
                    <DateInput label={"Hora de inicio"} name={"initial_time"} control={control} type={"time"} />
                </div>
            </ContainerInput>
            <ContainerInput>
                <div style={{ display: "flex", gap: "10px" }}>
                    <DateInput label={"Fecha de Fin"} name={"end_date"} control={control} type={"date"} />
                    <DateInput label={"Hora de Fin"} name={"end_time"} control={control} type={"time"} />
                </div>
            </ContainerInput>
            <ContainerButton>
                <Button type="submit" name="submit" disabled={response}> Guardar</Button>
                <CancelButton disabled={response} onClick={handleCancel}/>
            </ContainerButton>
        </form>
    )
}

FormManagementPeriod.propTypes = {
    // data: PropTypes.array.isRequired    
};