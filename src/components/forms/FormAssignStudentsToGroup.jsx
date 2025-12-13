import React, { useState } from 'react'
import { AsignStudentsToGroupSchema } from '../../models/schemas/AsignStudentsToGroupSchema';
import { closeFormModal, customAlert } from '../../utils/domHelper';
import { ContainerInput } from '../login/ContainerInput';
import { SelectInput } from './components/SelectInput';
import { Validate } from './components/Validate';
import { ContainerButton } from '../login/ContainerButton';
import { Button } from '../login/Button';
import CancelButton from './components/CancelButon';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { postApi } from '../../services/axiosServices/ApiService';
import { useParams } from 'react-router-dom';
const options = [
  { value: 'apellido', text: 'Ordenado por apellido paterno' },
  { value: 'id_asc', text: 'Ordenado por ID ascendente' },
  { value: 'id_desc', text: 'Ordenado por ID descendente' },
  { value: 'random', text: 'Orden aleatorio' },
];

export const FormAssignStudentsToGroup = () => {
    const id = useParams().id;
    const [response, setResponse] = useState(false);
    const { control, handleSubmit, formState: { errors }, setError, reset } = useForm({
        defaultValues: {
            order_type: '',
        },
        resolver: zodResolver(AsignStudentsToGroupSchema),
    });
    const onSubmit = async (data) => {
        setResponse(true);
        const formData = new FormData();
        formData.append('order_type', data.order_type);
        formData.append('evaluation_id', id);
        try {
            const response = await postApi(`groups/addStudentsToGroup`, formData);
            if (response.status === 422) {
                for (let key in response.data.errors) {
                    setError(key, { type: "custom", message: response.data.errors[key][0] });
                }
                return;
            }
            customAlert("Estudiantes asignados correctamente", 'success');
            closeFormModal("asignarEstudiantes");
            resetForm();
        } catch (error) {
            if (response?.status === 403) {
                customAlert("No tienes permisos para realizar esta acción", "error");
            } else {
                customAlert(error.response?.data?.message || "Error al asignar estudiantes", "error");
            }
            closeFormModal("asignarEstudiantes");
            resetForm();
        } finally {
            setResponse(false);
        }
    }
    const resetForm = () => {
        setResponse(false);
        reset();
    }
    const handleCancel = () => {
        closeFormModal("asignarEstudiantes");
        resetForm(); 
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <ContainerInput>
                <SelectInput label="Seleccione un orden" name="order_type" options={options} control={control} />
                <Validate errors={errors.order_type} />
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
