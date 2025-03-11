
/* eslint-disable no-unused-vars */
import React from 'react'
import ButtonAdd from './ButtonAdd'
import { Area } from './Area'
import ModalRegister from './ModalRegister'


export const IndexArea = () => {
  const modalId = "registroArea"
  return (
    <div className='m-3 p-3'>
      <div className="d-flex justify-content-center gap-2">
        <ButtonAdd modalId={modalId}/>
      </div>
      <div className=''>
        <Area />
      </div>
      <ModalRegister modalId={modalId} title="Registrar Area" />
    </div>
  )
}
