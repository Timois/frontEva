/* eslint-disable no-unused-vars */
import React from 'react'
import { ButtonImport } from './ButtonImport'
import { ModalImport } from './ModalImport'
import { StudentsList } from './StudentsList'

export const IndexStudents = () => {
  const modalImport = "importarEstudiantes"
  return (
    <div>
       <div className="d-flex justify-content-center">
        <ButtonImport modalId={modalImport}/>
        </div>
        <div className='w-100 d-flex justify-content-center'>
        <StudentsList />
        </div>
      <ModalImport ModalId={modalImport} title={"Importar Estudiantes"}/>
    </div>
  )
}
