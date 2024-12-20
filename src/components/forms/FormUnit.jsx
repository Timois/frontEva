/* eslint-disable no-unused-vars */
// Componente FormUnit
import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ContainerInput } from '../login/ContainerInput';
import { Input } from '../login/Input';
import { ContainerButton } from '../login/ContainerButton';
import { Button } from '../login/Button';
import { Validate } from './components/Validate';
import { SelectInput } from './components/SelectInput';
import { UnitSchema } from '../../models/schemas/UnitSchema';
import { UnitContext } from '../../context/UnitProvider';
import { postApi } from '../../services/axiosServices/ApiService';
import CancelButton from './components/CancelButon';
import { closeFormModal, customAlert } from '../../utils/domHelper';

const arrayOption = [{ value: "unidad", text: "Unidad" }, { value: "facultad", text: "Facultad" }];

export const FormUnit = () => {
    const [response, setResponse] = useState(false);
    const { addUnit } = useContext(UnitContext);
    const { control, handleSubmit, reset, setValue, formState: { errors }, setError } = useForm({
        resolver: zodResolver(UnitSchema),
    });
    const [preview, setPreview] = useState(null);

    const onSubmit = async (data) => {
        setResponse(true);

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("initials", data.initials);
        formData.append("type", data.type);
        formData.append("logo", data.logo[0]);

        const response = await postApi("unit/save", formData);
        setResponse(false);

        if (response.status === 422) {
            for (var key in response.data.errors) {
                setError(key, { type: "custom", message: response.data.errors[key][0] });
            }
            return null;
        }

        customAlert("Unidad Guardada", "success");

        closeFormModal("registroUnidad");

        addUnit(response);
        resetForm();  // Llamada a la función para limpiar el formulario y la vista previa
    };

    const resetForm = () => {
        reset({ name: '', initials: '', type: '', logo: null });
        setPreview(null);  // Limpiar la vista previa de la imagen
    };

    const onChange = (e) => {
        setValue("logo", e.target.files);
        setPreview(URL.createObjectURL(e.target.files[0]));
    };

    const handleCancel = () => {
        resetForm();
    };

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
                <input type="file" onChange={onChange} />
                <Validate error={errors.logo} />
                {preview ? <img src={preview} alt="preview" width={80} height={80} /> : null}
            </ContainerInput>
            <ContainerInput>
                <SelectInput label="Seleccione el tipo" name="type" options={arrayOption} control={control} error={errors.type} />
                <Validate error={errors.type} />
            </ContainerInput>
            <ContainerButton>
                <Button type="submit" name="submit" disabled={response}>
                    <span>{response ? "Guardando..." : "Guardar"}</span>
                </Button>

                <CancelButton disabled={response} onClick={handleCancel} />
            </ContainerButton>
        </form>
    );
};
