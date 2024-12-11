/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import { useContext, useEffect, useState } from "react"
import { PeriodContext } from "../../context/PeriodProvider"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { PeriodSchema } from "../../models/schemas/PeriodSchema"
import { postApi } from "../../services/axiosServices/ApiService"
import { ContainerInput } from "../login/ContainerInput"
import { Input } from "../login/Input"
import { Validate } from "../forms/components/Validate"
import { SelectInput } from "../forms/components/SelectInput"
import { ContainerButton } from "../login/ContainerButton"
import { Button } from "../login/Button"


const option = [{value: "1", text: "1"},{value: "2", text: "2"},{value: "3", text: "3"},{value: "4", text: "4"}, {value: "5", text: "5"}]
export const EditPeriod = ({data}) => {
    
    const [ response, setResponse ] = useState(false)
    const { updatePeriod } = useContext(PeriodContext)
    
    const { control, handleSubmit, reset, setValue, formState: { errors }, setError } = useForm({ resolver: zodResolver(PeriodSchema) })

    useEffect(() => {
        if (data) {
          setValue("period", data.period || "")
          setValue("level", data.level || "")
        }
      }, [data, setValue])
    const onSubmit = async (formData) => {
        setResponse(true)

        const requestData = new FormData()
        requestData.append("period", formData.period)
        requestData.append("level", formData.level)

        try {
            const response = await postApi(`periods/edit/${data.id}`, requestData)
            setResponse(false)
            
            console.log("::Form::", formData)
            console.log("::RESPONSE::", response)

            if (response.status === 422) {
                for (let key in response.data.errors) {
                    setError(key, { type: "custom", message: response.data.errors[key][0] })
                }
                return
            }
            updatePeriod(response)
            reset()
        } catch (error) {
            console.error("Error al actualizar periodo:", error)
            setResponse(false)
        }
    }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
        
        <ContainerInput>
            <Input name={"period"} control={control} type={"text"} placeholder={"Ingrese un periodo"} />
            <Validate error={errors.period}/>
        </ContainerInput>
        <ContainerInput>
            <SelectInput 
                name={"level"}
                control={control}
                options={option}
                error={errors.level}
            />
            <Validate error={errors.level}/>
        </ContainerInput>
        <ContainerButton>
                <Button type="submit" name="submit" disabled={response}>
                    <span>{response ? "Guardando..." : "Guardar"}</span>
                </Button>
                <Button type="button" name="reset" onClick={() => reset()}>
                    <span>Limpiar</span>
                </Button>
            </ContainerButton>
    </form>
  )
}
