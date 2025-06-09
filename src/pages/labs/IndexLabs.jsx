import ButtonAdd from "./ButtonAdd"
import { Labs } from "./Labs"
import ModalRegister from "./ModalRegister"
export const IndexLabs = () => {
    const modalRegister = 'registerLab'
  return (
    <div className='m-3 p-3'>
        <div className='d-flex justify-content-center'>
            <ButtonAdd modalId={modalRegister} />
        </div>
        <div className='w-100 d-flex justify-content-center'>
            <Labs />
        </div>
        <ModalRegister modalId={modalRegister} title="Registrar Laboratorio" />
    </div>
  )
}
