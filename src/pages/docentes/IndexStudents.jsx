/* eslint-disable no-unused-vars */
import React from 'react'
import { ButtonImport } from './ButtonImport'
import { ModalImport } from './ModalImport'
import { StudentsList } from './StudentsList'
import CheckPermissions from '../../routes/CheckPermissions'

export const IndexStudents = () => {
  const modalImport = "importarEstudiantes"
  return (
    <div>
      <CheckPermissions requiredPermission="importar-postulantes">
        <div className="d-flex justify-content-center">
          <ButtonImport modalId={modalImport} />
        </div>
      </CheckPermissions>
      <div className='w-100 d-flex justify-content-center'>
        <StudentsList />
      </div>
      <CheckPermissions requiredPermission="importar-postulantes">
        <ModalImport ModalId={modalImport} title={"Importar Estudiantes"} />
      </CheckPermissions>
    </div>
  )
}
