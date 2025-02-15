/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React from 'react'
import { ButtonImport } from './ButtonImport'
import { ImportQuestions } from './ImportQuestions'
import { ModalImportQuestions } from './ModalImportQuestions'

export const IndexQuestions = () => {
  return (
    <div className='m-3 p-3'>
      <div className="d-flex justify-content-center">
        <ButtonImport modalId={modalIdPI} />
      </div>
      <div className='w-100 d-flex justify-content-center'>
        <ImportQuestions />
      </div>
      <ModalImportQuestions modalIdP={modalId} title="Registrar Periodo" />
    </div>
  )
}
