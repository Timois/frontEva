

import ButtonAdd from "./ButtonAdd"
import { Groups } from "./Groups"
import ModalRegister from "./ModalRegister"
export const IndexGroups = () => {
    const modalRegister = "registerGroup"
    return (
        <div className='m-3 p-3'>
            <div className="d-flex justify-content-center">
                <ButtonAdd modalId={modalRegister} />
            </div>
            <div className='w-100'>
                <Groups />
            </div>
            <ModalRegister modalId={modalRegister} title="Registrar Grupo" />
        </div>
    )
}
