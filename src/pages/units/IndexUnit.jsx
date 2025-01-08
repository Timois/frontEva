/* eslint-disable no-unused-vars */
import React from 'react'
import { Unidad } from './Unidad'
import ButtonModal from './ButtonAdd'
import ModalRegister from './ModalRegister'


export const IndexUnit = () => {
  const modalId = "registroUnidad"

  return (
    <div className='m-3 p-3'>
      <div className="d-flex justify-content-center">
        <ButtonModal modalId={modalId} title="Editar Unidad" />
      </div>
      <div className=''>
        <Unidad />
      </div>
      <ModalRegister modalId={modalId} title="Registrar Unidad Academica" />

    </div>
  )
}
