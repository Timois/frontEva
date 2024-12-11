/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CareerSchema } from '../../models/schemas/CareerSchema'
import { ContainerInput } from '../login/ContainerInput'
import { Input } from '../login/Input'
import { ContainerButton } from '../login/ContainerButton'
import { Button } from '../login/Button'
import { Validate } from './components/Validate'
import { SelectInput } from './components/SelectInput'
import { CareerContext } from '../../context/CareerProvider'
import { UnitContext } from '../../context/UnitProvider'
import { useFetchUnit } from '../../hooks/fetchUnit'
import { postApi } from '../../services/axiosServices/ApiService'


export const FormCareer = () => {
    const { getData } = useFetchUnit()
    const { units } = useContext(UnitContext)
    const [response, setResponse] = useState(false)
    const { addCareer } = useContext(CareerContext)
    const [array, setArray] = useState([])
    
    const { control, handleSubmit, reset, setValue, formState: { errors }, setError } = useForm({
        resolver: zodResolver(CareerSchema)
    })


    const onSubmit = async (data) => {
        setResponse(true)

        const formData = new FormData()
        formData.append("name", data.name)
        formData.append("initials", data.initials)
        formData.append("logo", data.logo[0])
        formData.append("unit_id", data.unit_id)
        
        const response = await postApi("career/save", formData)
        setResponse(false)

        if (response.status == 422) {
            for(var key in response.data.errors){
                setError(key, {type: "custom", message: response.data.errors[key][0]})
            }
            return null
        }
        addCareer(response)
        reset()
    }

    const formatData = () => {
        const newArray = units.map(element =>
        ({
            value: element.id, text: element.name
        })
        );
        setArray(newArray)
    }

    useEffect(() => {
        getData()
    }, [])

    useEffect(() => {
        formatData()
    }, [units])

    return (
        <form onSubmit={handleSubmit(onSubmit)} >
            <ContainerInput>
                <Input name={"name"} control={control} type={"text"} placeholder={"Ingrese un nombre"} />
                <Validate error={errors.name} />
            </ContainerInput>
            <ContainerInput>
                <Input name={"initials"} control={control} type={"text"} placeholder={"Ingrese la sigla"} />
                <Validate error={errors.initials} />
            </ContainerInput>
            <ContainerInput>
                <input
                    type="file"
                    onChange={(e) => setValue("logo", e.target.files)}
                />
                <Validate error={errors.logo} />
            </ContainerInput>
            <ContainerInput>
                <SelectInput
                    name="unit_id"
                    options={array}
                    control={control}
                    error={errors.type}
                />
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
