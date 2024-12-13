/* eslint-disable no-unused-vars */
import React from 'react'
import { Unidad } from './Unidad'
import ButtonModal from './ButtonAdd'
import ModalRegister from './ModalRegister'


export const IndexUnit = () => {
  const modalId = "registroUnidad"

  return (
    <div className='m-3 p-3'>

      <ButtonModal modalId={modalId} title="Editar Unidad"/>
      <div className='w-100 d-flex justify-content-center'>
        <Unidad />
      </div>
      <ModalRegister modalId={modalId} title="Registro de Unidades Academicas"/>

    </div>
  )
}
