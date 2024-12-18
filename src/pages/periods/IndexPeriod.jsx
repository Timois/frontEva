/* eslint-disable no-unused-vars */
import React from 'react'
import { Periodos } from './Periodos'
import ButtonAdd from './ButtonAdd'
import ModalRegister from './ModalRegister'

export const IndexPeriod = () => {
  const modalId = "registerPeriod"
  return (
    <div className='m-3 p-3'>
      <div className="d-flex justify-content-center">
        <ButtonAdd modalIdP={modalId} />
      </div>
      <div className='w-100 d-flex justify-content-center'>
        <Periodos />
      </div>
      <ModalRegister modalIdP={modalId} title="Registrar Periodo" />
    </div>
  )
}
