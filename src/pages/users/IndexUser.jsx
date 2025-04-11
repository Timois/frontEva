
import ButtonAdd from "./ButtonAdd"
import ModalRegister from "./ModalRegister"
import { User } from "./User"
import CheckPermissions from "../../routes/CheckPermissions"



export const IndexUser = () => {
  const modalIdP = "registerUser"
  return (
    <div className='m-3 p-3'>
      <CheckPermissions requiredPermission="editar-usuarios">
        <div className="d-flex justify-content-center">
          <ButtonAdd modalIdP={modalIdP} />
        </div>
      </CheckPermissions>
      <div className='w-100 d-flex justify-content-center'>
        <User />
      </div>
      <CheckPermissions requiredPermission="editar-usuarios">
        <ModalRegister modalIdP={modalIdP} title="Registrar Usuario" />
      </CheckPermissions>
    </div>
  )
}
