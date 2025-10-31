/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CareerSchema } from "../../models/schemas/CareerSchema";
import { ContainerInput } from "../login/ContainerInput";
import { Input } from "../login/Input";
import { ContainerButton } from "../login/ContainerButton";
import { Button } from "../login/Button";
import { CareerContext } from "../../context/CareerProvider";
import { UnitContext } from "../../context/UnitProvider";
import { useFetchUnit } from "../../hooks/fetchUnit";
import { postApi } from "../../services/axiosServices/ApiService";
import { Validate } from "../forms/components/Validate";
import { SelectInput } from "../forms/components/SelectInput";
import CancelButton from "../forms/components/CancelButon";
import { closeFormModal, customAlert } from "../../utils/domHelper";
import { InputFile } from "../forms/components/InputFile";

const arrayOption = [
    { value: "mayor", text: "Unidad Mayor" },
    { value: "facultad", text: "Facultad" },
    { value: "dependiente", text: "Dependiente" },
    { value: "carrera", text: "Carrera" },
];

export const EditCareer = ({ data, closeModal }) => {
    const { getData, refreshUnits } = useFetchUnit();
    const { units } = useContext(UnitContext);
    const [response, setResponse] = useState(false);
    const { updateCareer } = useContext(CareerContext);
    const [array, setArray] = useState([]);
    const [preview, setPreview] = useState(null);
    const [selectedType, setSelectedType] = useState("");

    const { control, handleSubmit, reset, setValue, formState: { errors }, setError, watch, } = useForm({
        resolver: zodResolver(CareerSchema),
    });

    useEffect(() => {
        if (data) {
            setValue("name", data.name);
            setValue("initials", data.initials);
            setValue("type", data.type);
            setSelectedType(data.type);
            setValue("unit_id", String(data.unit_id));
            setPreview(data.logo);
        }
    }, [data, setValue]);

    // Actualiza unit_id a "0" si el tipo cambia a algo distinto de "dependiente"
    useEffect(() => {
        if (!data) return;

        if (selectedType !== "mayor" && selectedType !== "facultad" && data.unit_id) {
            setValue("unit_id", String(data.unit_id));
        } else {
            setValue("unit_id", "0");
        }
    }, [selectedType, setValue, data]);

    const onSubmit = async (formData, event) => {
        if (event) event.preventDefault()
        setResponse(true);

        const requestData = new FormData();
        requestData.append("name", formData.name);
        requestData.append("initials", formData.initials);
        requestData.append("type", formData.type);
        requestData.append("unit_id", formData.unit_id);
        if (formData.logo && formData.logo.length > 0) {
            requestData.append("logo", formData.logo[0]);
        }

        try {
            const response = await postApi(`careers/edit/${data.id}`, requestData);
            setResponse(false);

            if (response.status === 422) {
                for (let key in response.data.errors) {
                    setError(key, { type: "custom", message: response.data.errors[key][0] });
                }
                return;
            }
            await refreshUnits();
            updateCareer(response.data);
            customAlert("Carrera Editada", "success");
            closeFormModal("editarCarrera");
            reset();
        } catch (error) {
            closeFormModal("editarCarrera");
            customAlert(error.response?.data?.message, "error");
        } finally {
            setResponse(false);
        }
    };

    const handleCancel = () => {
        closeModal();
    };

    const formatData = () => {
        const newArray = units.map((element) => ({
            value: element.id,
            text: element.name,
        }));
        setArray(newArray);
    };

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        formatData();
    }, [units]);

    const onChange = (e) => {
        setValue("logo", e.target.files);
        setPreview(URL.createObjectURL(e.target.files[0]));
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
                            onChange={field.onChange}
                            error={errors.logo}
                            accept="image/*"
                            defaultPreview={preview}
                        />
                    )}
                />
                <Validate error={errors.logo} />
            </ContainerInput>
            <ContainerInput>
                <SelectInput
                    label="Seleccione el tipo"
                    name="type"
                    options={arrayOption}
                    control={control}
                    error={errors.type}
                    onChange={(e) => setSelectedType(e.target.value)}
                />
                <Validate error={errors.type} />
            </ContainerInput>
            {(selectedType === "dependiente" || selectedType === "carrera") && ( // Renderiza solo si el tipo es "dependiente"
                <ContainerInput>
                    <SelectInput
                        label="Seleccione la Unidad Académica"
                        name="unit_id"
                        options={array}
                        control={control}
                        error={errors.unit_id}
                    />
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
