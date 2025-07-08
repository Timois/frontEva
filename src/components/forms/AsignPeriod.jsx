/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { AcademicManagementPeriodSchema } from '../../models/schemas/AcademicManagementPeriodSchema'
import { useForm } from 'react-hook-form'
import { postApi } from '../../services/axiosServices/ApiService'
import { closeFormModal, customAlert } from '../../utils/domHelper'
import { ContainerInput } from '../login/ContainerInput'
import { SelectInput } from './components/SelectInput'
import { ContainerButton } from '../login/ContainerButton'
import { Button } from 'bootstrap'
import CancelButton from './components/CancelButon'
import PropTypes from 'prop-types'
import { Validate } from './components/Validate'
import { DateInput } from '../forms/components/DateInput'
// eslint-disable-next-line react/prop-types
export const AsignPeriod = ({ data }) => {
  const [response, setResponse] = useState(false)
  const { control, handleSubmit, reset, formState: { errors }, setError } = useForm({
    resolver: zodResolver(AcademicManagementPeriodSchema)
  })
  const onSubmit = async (data) => {
    setResponse(true)
    const formData = new FormData()
    formData.append("initial_date", data.initial_date)
    formData.append("end_date", data.end_date)
    formData.append("status", data.status)
    formData.append("academic_management_career_id", data.academic_management_career_id)
    formData.append("period_id", data.career_id)
    try {
      const response = await postApi("academic_management_period/saveAssign", formData)

      if (response.status == 422) {
        for (var key in response.data.errors) {
          setError(key, { type: "custom", message: response.data.errors[key][0] })
        }
        return null
      }
      customAlert("Periodo Asignado", "success")
      closeFormModal("asignarPeriodo")
      resetForm()
    } catch (error) {
      if (error.response.status === 403) {
        customAlert("No tienes permisos para crear un periodo", "error")
      } else {
        customAlert(error.response?.data?.message || "Error al crear el periodo", "error")
        resetForm()
        closeFormModal("asignarPeriodo")
      }
    } finally {
      setResponse(false)
    }
  }
  const resetForm = () => {
    reset({
      initial_date: "",
      end_date: "",
      status: "",
      academic_management_career_id: "",
      period_id: ""
    })
  }
  const handleCancel = () => {
    closeFormModal("asignarPeriodo")
    reset()
  }
  return (
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      <ContainerInput>
        <DateInput label={"Fecha de inicio"} name={"initial_date"} control={control} type={"date"} />
        <Validate error={errors.initial_date} />
      </ContainerInput>
      <ContainerInput>
        <DateInput label={"Fecha de fin"} name={"end_date"} control={control} type={"date"} />
        <Validate error={errors.end_date} />
      </ContainerInput>
      <ContainerInput>
        <SelectInput label="Seleccione el tipo" name="type" options={arrayOption} control={control} error={errors.type} />
        <Validate error={errors.type} />
      </ContainerInput>
      <ContainerInput>
        <SelectInput
          label="Seleccione una gestion del periodo"
          name="academic_management_career_id"
          options={data?.academic_management_careers}
          control={control}
          errors={errors.academic_management_careers}
          castToNumber={true}
        />
      </ContainerInput>
      <ContainerInput>
        <SelectInput
          label="Seleccione una periodo"
          name="period_id"
          options={data?.academic_managements}
          control={control}
          errors={errors.periods}
          castToNumber={true}
        />
      </ContainerInput>
      <ContainerButton>
        <Button type="submit" name="submit" disabled={response}>Guardar</Button>
        <CancelButton disabled={response} onClick={handleCancel}/>
      </ContainerButton>
    </form>
  )
}
AsignPeriod.propTypes = {
  data: PropTypes.object.isRequired
}
