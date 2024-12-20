import CancelButton from "./components/CancelButon"
import { SelectInput } from "./components/SelectInput"
import { Button } from "../login/Button"
import { ContainerButton } from "../login/ContainerButton"
import { ContainerInput } from "../login/ContainerInput"
import PropTypes from 'prop-types'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { closeFormModal, customAlert } from "../../utils/domHelper"
import { postApi } from "../../services/axiosServices/ApiService"
import { useParams } from "react-router-dom"
import { AcademicManagementCareerPeriodSchema } from "../../models/schemas/AcademicManagementCareerPeriodSchema"
import { DateInput } from "./components/DateInput"

export const FormManagementPeriod = ({ data }) => {
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
        const initialDateTime = `${data.initial_date}T${data.initial_time}`;
        const endDateTime = `${data.end_date}T${data.end_time}`;
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

        reset({
            period_id: ""
        })

        const response = await postApi("academic_management_period/save", formData)
        console.log(response)
        if (response.status == 422) {
            for (var key in response.data.errors) {
                setError(key, { type: "custom", message: response.data.errors[key][0] })
            }
            return null
        }

        customAlert("Periodo Registrado", "success")
        closeFormModal("asignarPeriodo")
    };

    const onError = (errors, e) => console.log(errors, e)

    return (
        <form onSubmit={handleSubmit(onSubmit, onError)}>
            <ContainerInput>
                <SelectInput
                    label="Seleccione un periodo"
                    name="period_id"
                    options={data?.periods}
                    control={control}
                    errors={errors.periods}
                />
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
                <Button type="submit" name="submit">Guardar</Button>
                <CancelButton />
            </ContainerButton>
        </form>
    )
}

FormManagementPeriod.propTypes = {
    data: PropTypes.object.isRequired
};