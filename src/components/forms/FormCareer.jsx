/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
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
import { InputFile } from './components/InputFile';

const arrayOption = [
    { value: "mayor", text: "Unidad Mayor" },
    { value: "facultad", text: "Facultad" },
    { value: "dependiente", text: "Dependiente" },
    { value: "carrera", text: "Carrera" }
];

export const FormCareer = () => {
    const { getData, refreshUnits } = useFetchUnit();
    const { units } = useContext(UnitContext);
    const [response, setResponse] = useState(false);
    const { addCareer } = useContext(CareerContext);
    const [array, setArray] = useState([]);
    const [resetKey, setResetKey] = useState(0);

    const { control, handleSubmit, reset, setValue, watch, formState: { errors }, setError } = useForm({
        defaultValues: {
            logo: [],
        },
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

        if (data.logo && data.logo.length > 0) {
            formData.append("logo", data.logo[0]);
        }

        formData.append("type", data.type);
        if (data.unit_id) formData.append("unit_id", data.unit_id);

        try {
            const response = await postApi("careers/save", formData);

            if (response.status === 422) {
                for (const key in response.data.errors) {
                    setError(key, { type: "custom", message: response.data.errors[key][0] });
                }
                return;
            }

            await refreshUnits();
            getData();

            const typeMessages = {
                mayor: "Unidad Mayor registrada correctamente",
                facultad: "Facultad registrada correctamente",
                dependiente: "Unidad Dependiente registrada correctamente",
                carrera: "Carrera registrada correctamente"
            };
            customAlert(typeMessages[data.type] || "Registro exitoso", "success");
            closeFormModal("registroCarrera");
            resetForm();
        } catch (error) {
            if (error.response?.status === 403) {
                customAlert("No tienes permisos para realizar esta acción", "error");
                closeFormModal("registroCarrera");
            } else {
                const errorType = data.type === "carrera" ? "la carrera" : "la unidad académica";
                customAlert(error.response?.data?.message || `Error al guardar ${errorType}`, "error");
                closeFormModal("registroCarrera");
            }
        } finally {
            setResponse(false);
        }
    };

    const resetForm = () => {
        reset({ name: '', initials: '', unit_id: '', logo: '' });
        setPreview(null);
        setResetKey(prev => prev + 1); // 👈 fuerza a remount del InputFile
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
                <Controller
                    name="logo"
                    control={control}
                    render={({ field }) => (
                        <InputFile
                            key={resetKey} // 👈 esto lo reinicia completamente
                            onChange={field.onChange}
                            error={errors.logo}
                            accept="image/*"
                        />
                    )}
                />
                <Validate error={errors.logo} />

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
