/* eslint-disable no-unused-vars */
import React from 'react'
import { ButtonImport } from './ButtonImport'
import { ModalImport } from './ModalImport'
import { StudentsList } from './StudentsList'
import CheckPermissions from '../../routes/CheckPermissions'
import ButtonAdd from './ButtonAdd'
import ModalRegister from './ModalRegister'
export const IndexStudents = () => {
  const modalImport = "importarEstudiantes"
  const modalRegister = "registerStudent"
  return (
    <div>
      <CheckPermissions requiredPermission="importar-postulantes">
        <div className="d-flex justify-content-center gap-2">
          <ButtonImport modalId={modalImport} />
          <ButtonAdd modalIdP={modalRegister}/>
        </div>
      </CheckPermissions>
      <div className='w-100 d-flex justify-content-center'>
        <StudentsList />
      </div>
      <CheckPermissions requiredPermission="importar-postulantes">
        <ModalImport ModalId={modalImport} title={"Importar Estudiantes"} />
      </CheckPermissions>
      <ModalRegister modalId={modalRegister} title={"Registrar Estudiantes"} />
    </div>
  )
}
