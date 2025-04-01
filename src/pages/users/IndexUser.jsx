import ButtonAdd from "./ButtonAdd"
import ModalRegister from "./ModalRegister"
import { User } from "./User"



export const IndexUser = () => {
    const modalId = "registerUser"
  return (
    <div className='m-3 p-3'>
      <div className="d-flex justify-content-center">
        <ButtonAdd modalIdP={modalId} />
      </div>
      <div className='w-100 d-flex justify-content-center'>
        <User/>
      </div>
      <ModalRegister modalIdP={modalId} title="Registrar Periodo" />
    </div>
  )
}
