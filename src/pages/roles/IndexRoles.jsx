import ButtonAdd from "./ButtonAdd"
import ModalRegister from "./ModalRegister"
import { Roles } from "./Roles"


export const IndexRoles = () => {
    const modalId = "registroRol"
  return (
    <div className='m-3 p-3'>
        <div className="d-flex justify-content-center">
            <ButtonAdd modalId={modalId}/>
        </div>
        <div className='w-100 d-flex justify-content-center'>
            <Roles />
        </div>
        <ModalRegister modalId={modalId} title="Registrar Rol" />
    </div>
  )
}
