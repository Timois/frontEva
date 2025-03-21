/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CareerSchema } from '../../models/schemas/CareerSchema';
import { ContainerInput } from '../login/ContainerInput';
import { Input } from '../login/Input';
import { ContainerButton } from '../login/ContainerButton';
import { Button } from '../login/Button';
import { Validate } from './components/Validate';
import { SelectInput } from './components/SelectInput';
import { CareerContext } from '../../context/CareerProvider';
import { UnitContext } from '../../context/UnitProvider';
import { useFetchUnit } from '../../hooks/fetchUnit';
import { postApi } from '../../services/axiosServices/ApiService';
import CancelButton from './components/CancelButon';
import { closeFormModal, customAlert } from '../../utils/domHelper';

const arrayOption = [
    { value: "mayor", text: "Unidad Mayor" },
    { value: "facultad", text: "Facultad" },
    { value: "dependiente", text: "Dependiente" },
    { value: "carrera", text: "Carrera" }
];

export const FormCareer = () => {
    const { getData } = useFetchUnit();
    const { units } = useContext(UnitContext);
    const [response, setResponse] = useState(false);
    const { addCareer } = useContext(CareerContext);
    const [array, setArray] = useState([]);

    const { control, handleSubmit, reset, setValue, watch, formState: { errors }, setError } = useForm({
        resolver: zodResolver(CareerSchema)
    });

    const [preview, setPreview] = useState(null);
    const selectedType = watch("type");

    useEffect(() => {
        if (selectedType === "mayor" || selectedType === "facultad") {
            setValue("unit_id", "0");
        }
    }, [selectedType, setValue]);
    
    const onSubmit = async (data) => {
        setResponse(true);
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("initials", data.initials);
        formData.append("logo", data.logo[0]);
        formData.append("type", data.type);
        if (data.unit_id) formData.append("unit_id", data.unit_id);

        const response = await postApi("career/save", formData);
        setResponse(false);

        if (response.status === 422) {
            for (const key in response.data.errors) {
                setError(key, { type: "custom", message: response.data.errors[key][0] });
            }
            return;
        }
        // addCareer(response);
        getData()
        customAlert("Carrera Guardada", "success");
        closeFormModal("registroCarrera");
        resetForm();
    };

    const resetForm = () => {
        reset({ name: '', initials: '', unit_id: '', logo: null });
        setPreview(null);
    };

    const formatData = () => {
        const newArray = units.map(element => ({ value: element.id, text: element.name }));
        setArray(newArray);
    };

    const handleCancel = () => {
        resetForm();
    };

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        formatData();
    }, [units]);

    const onChange = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setValue("logo", files);
            const objectURL = URL.createObjectURL(files[0]);
            setPreview(objectURL);
            return () => URL.revokeObjectURL(objectURL);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <ContainerInput>
                <Input name="name" control={control} type="text" placeholder="Ingrese un nombre" />
                <Validate error={errors.name} />
            </ContainerInput>
            <ContainerInput>
                <Input name="initials" control={control} type="text" placeholder="Ingrese la sigla" />
                <Validate error={errors.initials} />
            </ContainerInput>
            <ContainerInput>
                <input type="file" onChange={onChange} />
                <Validate error={errors.logo} />
                {preview && <img src={preview} alt="preview" width={80} height={80} />}
            </ContainerInput>
            <ContainerInput>
                <SelectInput label="Seleccione el tipo" name="type" options={arrayOption} control={control} error={errors.type} />
                <Validate error={errors.type} />
            </ContainerInput>
            {(selectedType === "carrera" || selectedType === "dependiente") && (
                <ContainerInput>
                    <SelectInput label="Selecciona una Unidad Académica" name="unit_id" options={array} control={control} error={errors.unit_id} />
                </ContainerInput>
            )}
            <ContainerButton>
                <Button type="submit" name="submit" disabled={response}>
                    <span>{response ? "Guardando..." : "Guardar"}</span>
                </Button>
                <CancelButton disabled={response} onClick={handleCancel} />
            </ContainerButton>
        </form>
    );
};
