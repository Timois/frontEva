import ButtonAdd from "./ButtonAdd"
import ModalRegister from "./ModalRegister"
import { Permisos } from "./Permisos"


export const IndexPermisos = () => {
    const modalId = "registroPermiso"
    return (
        <div className="m-3 p-3">
            <div className="d-flex justify-content-center">
                <ButtonAdd modalId={modalId} />
            </div>
            <div className='w-100 d-flex justify-content-center'>
                <Permisos />
            </div>
            <ModalRegister modalId={modalId} title="Registrar Permiso" />
        </div>
    )
}
