/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React from 'react'
import { ButtonImport } from './ButtonImport'
import ModalRegister  from './ModalRegister'
import { ImportQuestions } from './ImportQuestions'

export const IndexQuestions = () => {
  const modalId = "registerImport"
  return (

    <div className='m-3 p-3'>
      <div className="d-flex justify-content-center">
        <ButtonImport modalIdImp={modalId} />
      </div>
      <div className='w-100 d-flex justify-content-center'>
        <ImportQuestions />
      </div>
      <ModalRegister modalIdImp={modalId} title="Importar Excel de Preguntas" />
    </div>
  )
}
