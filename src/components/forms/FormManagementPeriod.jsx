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
import { Validate } from "./components/Validate"

export const FormManagementPeriod = ({ data }) => {
    const { control, handleSubmit, reset, formState: { errors }, setError } = useForm({
        resolver: zodResolver(AcademicManagementCareerPeriodSchema)
    })

    const career_id = useParams().id;

    const getManagementCareerIdByAttr = () => {
        const modal = document.getElementById("asignarPeriodo")
        return modal.getAttribute("data-academic_management_career_id")
    }

    const onSubmit = async (data) => {
        const formData = new FormData()
        formData.append("period_id", data.period_id)
        formData.append("career_id", career_id)
        formData.append("initial_date", data.initial_date)
        formData.append("end_date", data.end_date)
        formData.append("academic_management_career_id", getManagementCareerIdByAttr())

        reset({
            period_id: ""
        })

        const response = await postApi("academic_management_period/save", formData)

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
                <DateInput label={"Fecha de inicio"} name={"initial_date"} control={control} type={"date"} />
                <Validate error={errors.initial_date} />
            </ContainerInput>
            <ContainerInput>
                <DateInput label={"Fecha de fin"} name={"end_date"} control={control} type={"date"} />
                <Validate error={errors.end_date} />
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