
import CheckPermissions from "../../routes/CheckPermissions"
import ButtonAdd from "../ButtonAdd"
import ModalRegister from "../ModalRegister"
import { Groups } from "./Groups"
export const IndexGroups = () => {
    const modalRegister = "registerGroup"
    return (
        <div className='m-3 p-3'>
            <div>
                <CheckPermissions permission="crear-grupos">
                    <ButtonAdd modalId={modalRegister} />
                </CheckPermissions>
            </div>
            <div className='w-100 d-flex justify-content-center'>
                <Groups />
            </div>
            <CheckPermissions permission="crear-grupos" >
                <ModalRegister modalId={modalRegister} title="Registrar Grupo" />
            </CheckPermissions>
        </div >
    )
}
