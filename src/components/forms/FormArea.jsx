

/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react'
import { useFetchCareer } from '../../hooks/fetchCareers'
import { CareerContext } from '../../context/CareerProvider';
import { AreaContext } from '../../context/AreaProvider';
import { set, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AreaSchema } from '../../models/schemas/AreaSchema';
import { closeFormModal, customAlert } from '../../utils/domHelper';
import { postApi } from '../../services/axiosServices/ApiService';
import { SelectInput } from './components/SelectInput';
import { ContainerInput } from '../login/ContainerInput';
import { Input } from '../login/Input';
import { Validate } from './components/Validate';
import { Button } from '../login/Button';
import { ContainerButton } from '../login/ContainerButton';
import CancelButton from './components/CancelButon';

export const FormArea = () => {
    const { getDataCareer } = useFetchCareer();
    const { careers } = useContext(CareerContext);
    const [response, setResponse] = useState([]);
    const { AddArea } = useContext(AreaContext);
    const [array, setArray] = useState([]);
    const { control, handleSubmit, reset, formState: { errors }, setError } = useForm({
        resolver: zodResolver(AreaSchema)
    });

    const onSubmit = async (data) => {
        setResponse(true);
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.initials);
        formData.append("career_id", data.career_id);

        const response = await postApi("areas/save", formData);
        setResponse(false);

        if (response.status === 422) {
            for (const key in response.data.errors) {
                setError(key, { type: "custom", message: response.data.errors[key][0] });
            }
            return;
        }

        AddArea(response);
        customAlert("Area Guardada", "success");
        closeFormModal("registroArea");
        resetForm();
    };
    const resetForm = () => {
        reset({
            name: "",
            initials: "",
            career_id: ""
        });
    };

    const formatData = () => {
        const newArray = careers.map((element) => ({
            value: element.id,
            text: element.name,
        }));
        setArray(newArray);
    };

    const handleCancel = () => {
        resetForm();
    }
    useEffect(() => {
        getDataCareer();
    }, [careers]);


    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <ContainerInput>
                <Input name="name" control={control} type="text" placeholder="Ingrese el nombre" />
                <Validate error={errors.name} />
            </ContainerInput>
            <ContainerInput>
                <Input name="description" control={control} type="text" placeholder="Ingrese la descripcion" />
                <Validate error={errors.description} />
            </ContainerInput>
            <ContainerInput>
                <SelectInput label="Seleccione la carrera" name="career_id" control={control} options={array} error={errors.career_id}/>
            </ContainerInput>
            <ContainerButton>
                <Button type="submit" name="submit" disabled={response}>
                    <span>{response ? "Guardando..." : "Guardar"}</span>
                </Button>
                <CancelButton disabled={response} onClick={handleCancel} />
            </ContainerButton>
        </form>
    )
}
