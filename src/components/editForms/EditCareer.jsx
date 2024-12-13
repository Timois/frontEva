/* eslint-disable react/prop-types */
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
import { CareerContext } from '../../context/CareerProvider'
import { UnitContext } from '../../context/UnitProvider'
import { useFetchUnit } from '../../hooks/fetchUnit'
import { postApi } from '../../services/axiosServices/ApiService'
import { Validate } from '../forms/components/Validate'
import { SelectInput } from '../forms/components/SelectInput'
import CancelButton from '../forms/components/CancelButon'


export const EditCareer = ({ data, closeModal }) => {
    const { getData } = useFetchUnit()
    const { units } = useContext(UnitContext)
    const [response, setResponse] = useState(false)
    const { updateCareer } = useContext(CareerContext)
    const [array, setArray] = useState([])
    const [preview, setPreview] = useState(null)
    
    const { control, handleSubmit, reset, setValue, formState: { errors }, setError } = useForm({
        resolver: zodResolver(CareerSchema)
    })

    useEffect(() => {
        if(data){
            setValue("name", data.name)
            setValue("initials", data.initials)
            setValue("unit_id", data.unit_id)
            setPreview(data.logo)
        }

    }, [data, setValue])

    const onSubmit = async (formData) => {
        setResponse(true)

        const requestData = new FormData()
        requestData.append("name", formData.name)
        requestData.append("initials", formData.initials)
        requestData.append("unit_id", formData.unit_id)
        if (formData.logo && formData.logo[0]) {
            requestData.append("logo", formData.logo[0])
        }
        try {
            const response = await postApi(`career/edit/${data.id}`, requestData)
            setResponse(false)
            
            console.log("::Form::", formData)
            console.log("::RESPONSE::", response)

            if (response.status === 422) {
                for (let key in response.data.errors) {
                    setError(key, { type: "custom", message: response.data.errors[key][0] })
                }
                return
            }
            updateCareer(response)
            reset()
        } catch (error) {
            console.error("Error al actualizar unidad:", error)
            setResponse(false)
        }
    }
    const handleCancel = () => {
        closeModal(); // Close the modal
    };

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

    const onChange = (e) => {
        setValue("logo", e.target.files)
        setPreview(URL.createObjectURL(e.target.files[0]))
    }
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
                    onChange={onChange}
                />
                <Validate error={errors.logo} />
                {preview?<img src={preview} alt="preview" width={80} height={80}/>:null}
            </ContainerInput>
            <ContainerInput>
                <SelectInput
                    label="Seleccione la Unidad Academica"
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
                <CancelButton disabled={response} onClick={handleCancel}/>
            </ContainerButton>
        </form>
    )
}
