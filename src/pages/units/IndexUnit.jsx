/* eslint-disable no-unused-vars */
import React from 'react'
import { Unidad } from './Unidad'
import  ModalRegister from './ModalRegister'
import ButtonAdd from './ButtonAdd'


export const IndexUnit = () => {
  const modalId = "registroCarrera"

  return (
    <div className='m-3 p-3'>
      <div className="d-flex justify-content-center">
        <ButtonAdd modalId={modalId}/>
      </div>
      <div className='d-flex justify-content-center'>
        <Unidad />
      </div>
      <ModalRegister modalId={modalId} title="Registrar Carrera" />
    </div>
  )
}
