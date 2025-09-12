/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react"
import { GroupContext } from "../../context/GroupsProvider"
import { zodResolver } from "@hookform/resolvers/zod"
import { GroupSchema } from "../../models/schemas/GroupSchema"
import { useForm } from "react-hook-form"
import { fetchLabs } from "../../hooks/fetchLabs"
import CancelButton from "../forms/components/CancelButon"
import { Button } from "../login/Button"
import { ContainerButton } from "../login/ContainerButton"
import { Validate } from "../forms/components/Validate"
import { SelectInput } from "../forms/components/SelectInput"
import { ContainerInput } from "../login/ContainerInput"
import { Input } from "../login/Input"
import { updateApi } from "../../services/axiosServices/ApiService"
import { closeFormModal, customAlert } from "../../utils/domHelper"
import { useParams } from "react-router-dom"
import { useExamns } from "../../hooks/fetchExamns"
import { fetchGroupByEvaluation } from "../../hooks/fetchGroup"

export const EditGroup = ({ data }) => {
    const { id } = useParams();
    const { updateGroup } = useContext(GroupContext);
    const [response, setResponse] = useState(false);
    const [array, setArray] = useState([]);
    const { examn, getExamnById } = useExamns();
    const [groupId, setGroupId] = useState(null);
    const {refresGroups} = fetchGroupByEvaluation();
    const isEdit = true;
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
        setError,
    } = useForm({
        resolver: zodResolver(GroupSchema(isEdit)),
    });
    console.log(errors)
    const { labs, getDataLabs } = fetchLabs();
    
    useEffect(() => {
        getDataLabs();
    }, []);

    useEffect(() => {
        getExamnById(id);
    }, [id]);

    useEffect(() => {
        if (labs.length > 0) {
            const array = labs.map((lab) => ({
                value: lab.id,
                text: `${lab.name} - ${lab.location}`,
            }));
            setArray(array);
        }
    }, [labs]);

    useEffect(() => {
        if (data && labs.length > 0) {

            reset({
                name: data.name,
                description: data.description,
                laboratory_id: data.laboratory_id ?? "",
                order_type: data.order_type,
            });
            setGroupId(data.id);
        }
    }, [data, examn, labs]); // 👈 se agregó labs aquí    

    const evaluation_id = id;

    const onSubmit = async (data) => {
        setResponse(true);
        const requestData = new FormData();
        requestData.append('name', data.name);
        requestData.append('description', data.description);
        requestData.append('laboratory_id', Number(data.laboratory_id));
        requestData.append('evaluation_id', evaluation_id);
        try {
            const response = await updateApi(`groups/edit/${groupId}`, requestData);
            setResponse(false);

            if (response.status === 422) {
                for (let key in response.data.errors) {
                    setError(key, { type: 'custom', message: response.data.errors[key][0] });
                }
                return;
            }

            if (response) {
                updateGroup(response);
                customAlert('Grupo actualizado correctamente', 'success');
                refresGroups(evaluation_id);
                closeFormModal('editGroup');
                reset();
            } else {
                customAlert('Error al actualizar el grupo', 'error');
            }
        } catch (error) {
            if (error.response?.status === 403) {
                customAlert('No tienes permisos para realizar esta acción', 'error');
                closeFormModal('editGroup');
                reset();
            } else {
                customAlert(error.response?.data?.message || 'Error al actualizar el grupo', 'error');
                closeFormModal('editGroup');
            }
        } finally {
            setResponse(false);
        }
    };

    const handleCancel = () => {
        closeFormModal('editGroup');
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
             <div className="mb-3">
                <span className="text-align-center text-danger">Tiempo del examen {examn.time || "N/A"} minutos</span>
            </div>
            <ContainerInput>
                <Input name="name" placeholder="Ingrese el Nombre del grupo" control={control} errors={errors} />
                <Validate errors={errors.name} />
            </ContainerInput>

            <ContainerInput>
                <Input name="description" placeholder="Ingrese el turno del grupo" control={control} errors={errors} />
                <Validate errors={errors.description} />
            </ContainerInput>
            <ContainerInput>
                <SelectInput label="Seleccione un Ambiente" name="laboratory_id" options={array} control={control} />
                <Validate errors={errors.laboratory_id} />
            </ContainerInput>
            <ContainerButton>
                <Button type="submit" name="submit" disabled={response}>
                    <span>{response ? 'Guardando...' : 'Guardar'}</span>
                </Button>
                <CancelButton disabled={response} onClick={handleCancel} />
            </ContainerButton>
        </form>
    );
};
