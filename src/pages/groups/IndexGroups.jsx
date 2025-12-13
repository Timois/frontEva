import ButtonAdd from "./ButtonAdd"
import { ButtonAsignStudents } from "./ButtonAsignStudents"
import { Groups } from "./Groups"
import { ModalAsignStudents } from "./ModalAsignStudents"

export const IndexGroups = () => {
    const modalId = "asignarEstudiantes";
    return (
        <div className='m-3 p-3'>
            <div className="d-flex justify-content-center gap-2">
                <ButtonAdd />
                <ButtonAsignStudents modalId={modalId} />
            </div>
            <div className='w-100'>
                <Groups />
            </div>
            <ModalAsignStudents
                modalId={modalId}
                title="Asignar Estudiantes"
            />
        </div>
    )
}
